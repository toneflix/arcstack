import ErrorHandler from "./request-handlers";
import { HTTPError } from "h3";
import { HttpContext } from "clear-router/types/h3";

export class ValidationError extends HTTPError {
  errors: { [key: string]: string[] | string };
  status: number = 422;

  constructor(
    message?: string,
    errors: { [key: string]: string[] | string } = {},
    options?: ErrorOptions,
  ) {
    super(message ?? "Validation error", { ...options, status: 422 });
    this.errors = errors;
  }

  static withMessages(messages: { [key: string]: string[] }) {
    const keys = Object.keys(messages);
    const message =
      keys.length > 1
        ? `${messages[keys[0]][0]} and ${keys.length - 1} other error(s)`
        : messages[keys[0]][0];

    throw new ValidationError(message, messages);
  }
}

export class RequestError extends HTTPError {
  status: number;

  constructor(message?: string, statusCode: number = 400, options?: ErrorOptions) {
    super(message ?? "Bad Request", { ...options, status: statusCode });
    this.status = statusCode;
  }

  /**
   * @param value
   * @param message
   * @param code
   */
  static assertFound<T>(
    value: T | null | undefined,
    message: string,
    code: number = 404,
    ctx?: HttpContext,
  ): asserts value is T {
    if (!value) {
      if (ctx) {
        return ErrorHandler(new RequestError(message, code), ctx) as any;
      }

      throw new RequestError(message, code);
    }
  }

  /**
   * @param boolean
   * @param message
   * @param code
   * @param req
   * @param res
   * @throws {RequestError} Throws a RequestError if the boolean condition is true. If req and res are provided, it will send the error response immediately.
   */
  static abortIf<T>(
    boolean: T,
    message: string,
    code?: number,
    ctx?: HttpContext,
  ): asserts boolean is T {
    if (boolean) {
      if (ctx) {
        return ErrorHandler(new RequestError(message, code), ctx) as any;
      }

      throw new RequestError(message, code);
    }
  }
}

export class AutheticationError extends RequestError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, 401, options);
    this.message = message ?? "Unauthenticated";
  }
}
