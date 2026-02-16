import { EventHandlerRequest, H3Event, TypedServerRequest } from "h3";

import "clear-router/types/h3";
import { User } from "@prisma/client";

declare module "clear-router/types/h3" {
  interface HttpContext {
    req: TypedServerRequest & {
      user?: User | undefined;
      authToken?: string | undefined;
    };
  }
}

declare global {
  interface String {
    titleCase(): string;
    camelCase(): string;
    /**
     *
     * @param len Length of the string
     * @param suffix Suffix to add to the string
     */
    truncate(len: number = 20, suffix: string = "..."): string;
  }
}

export {};
