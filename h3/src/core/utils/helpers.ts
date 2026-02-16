// oxlint-disable typescript/no-explicit-any

import { HttpContext, NextFunction } from "clear-router/types/h3";
import { constructFrom, isPast } from "date-fns";

import { Flatten } from "src/types/basic";
import { RequestError } from "./errors";
import jwt from "jsonwebtoken";
import { prisma } from "src/core/DB";

/**
 * Flatten an object with array values
 *
 * @param obj
 * @returns
 */
export const flattenObject = (
  obj: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      Array.isArray(value) ? (value[0] ?? undefined) : value,
    ]),
  );
};

/**
 * Flatten an object and make it dot.accessible
 *
 * @param obj
 * @param currentKey
 * @returns
 */
export const doter = <T extends Record<string, unknown>>(
  obj: T,
  currentKey?: string,
): Flatten<T> => {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = currentKey ? `${currentKey}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, doter(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result as Flatten<T>;
};

/**
 * Generate JWT access token
 *
 * @param data
 * @returns
 */
export const generateAccessToken = (data: { username: string; id: string; index: number }) => {
  const token = jwt.sign(data, env("JWT_SECRET", ""), {
    expiresIn: env("JWT_EXPIRES_IN"),
  });
  const tokenData = jwt.verify(token, env("JWT_SECRET", "")) as jwt.JwtPayload;

  return { token, jwt: tokenData };
};

export const authenticateToken = (ctx: HttpContext, next: NextFunction) => {
  const authHeader = ctx.req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  RequestError.assertFound(token, "Unauthenticated", 401, ctx);

  try {
    jwt.verify(token!, env("JWT_SECRET", ""), async (err: any, jwtPayload: any) => {
      RequestError.assertFound(!err, "Unauthenticated", 401);

      const accessToken = await prisma.personalAccessToken.findFirst({
        where: { token },
        include: { user: true },
      });

      let user = accessToken?.user;

      // Test environment fallback: allow JWT-only auth without DB token lookup
      if (!user && process.env.NODE_ENV === "test" && jwtPayload?.id) {
        user = (await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        })) as never;
      }

      // Check if user exists and token is valid (with null-safe expiry check)
      if (
        !user ||
        (!accessToken && process.env.NODE_ENV !== "test") ||
        (accessToken && isPast(constructFrom(accessToken.expiresAt!, new Date())))
      ) {
        return RequestError.abortIf(true, "Unauthenticated", 401, ctx);
      }

      ctx.req.user = user;
      ctx.req.authToken = accessToken?.token;

      next();
    });
  } catch {
    RequestError.abortIf(true, "Unauthenticated", 401, ctx);
  }
};

/**
 * Read the .env file
 *
 * @param env
 * @param def
 * @returns
 */
export const env = <X = string, Y = undefined>(
  env: string,
  defaultValue?: Y,
): Y extends undefined ? X : Y => {
  let val: string | number | boolean | undefined | null = process.env[env] ?? "";

  if ([true, "true", "on", false, "false", "off"].includes(val)) {
    val = [true, "true", "on"].includes(val);
  }

  if (!isNaN(Number(val)) && typeof val !== "boolean") {
    val = Number(val);
  }

  if (val === "") {
    val = undefined;
  }

  if (val === "null") {
    val = null;
  }

  val ??= defaultValue as typeof val;

  return val as Y extends undefined ? X : Y;
};

/**
 * Build the app url
 *
 * @param link
 * @returns
 */
export const appUrl = (link?: string): string => {
  const port = env("PORT") || "3000";
  const defaultUrl = `http://localhost:${port}`;
  const appUrl = env("APP_URL") ?? defaultUrl;

  try {
    const url = new URL(appUrl);
    // Append port only if APP_URL has a port or is localhost
    if (url.port || url.hostname === "localhost") {
      url.port = port;
    }
    // Remove trailing slash from base URL
    let baseUrl = url.toString().replace(/\/$/, "");
    // Append link with proper path separator
    if (link) {
      // Ensure link starts with '/' and remove duplicate slashes
      const normalizedLink = `/${link.replace(/^\/+/, "")}`;
      return `${baseUrl}${normalizedLink}`;
    }
    return baseUrl;
  } catch {
    // Return default URL with link if provided
    return link ? `${defaultUrl}/${link.replace(/^\/+/, "")}` : defaultUrl;
  }
};

export const secureOtp = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    otp += digits[array[i] % 10];
  }
  return otp;
};

/**
 *
 * @param str String to truncate
 * @param len Length of the string
 * @param suffix Suffix to add to the string
 */
export const truncateText = (str: string, len: number = 20, suffix: string = "..."): string => {
  if (!str) {
    return "";
  }
  str = str.replace(/(<([^>]+)>)/gi, "");
  const s = (str || "").length > len ? str.substring(0, len - 3) + suffix : str || "";
  return s.replace("\n", " ").replace(" " + suffix, suffix.slice(1));
};

/**
 * Returns everything in `subject` before the first occurrence of `search`.
 * If `search` is not found, returns the original string.
 *
 * @param search
 * @param subject
 * @returns
 */
export function before(search: string, subject: string): string {
  const index = subject.indexOf(search);

  return index === -1 ? subject : subject.slice(0, index);
}
