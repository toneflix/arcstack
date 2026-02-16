import { RequestError } from "@core/utils/errors";

import { type InitialRules } from "simple-body-validator";
import { validate, validateAsync } from "@core/utils/validator";
import { H3Event, readBody } from "h3";

export default class {
  body: Record<string, any> = {};
  event?: H3Event | undefined;
  request?: H3Event["req"] | undefined;

  constructor(event?: H3Event) {
    this.event = event;
    this.request = event?.req;
  }

  async setBody() {
    if (!this.event) return;

    this.body = (await readBody(this.event)) ?? {};
  }

  async validate<X extends InitialRules>(rules: X) {
    await this.setBody();
    return validate(this.body, rules);
  }

  async validateAsync<X extends InitialRules>(rules: X) {
    await this.setBody();
    return validateAsync(this.body, rules);
  }

  pagination(req?: H3Event["req"]) {
    this.request = req;

    // Get page and limit from query parameters, with defaults
    const query = req?.url ? new URLSearchParams(String(req.url.split("?")[1])) : null;

    const page = parseInt(String(query?.get("page"))) || 1;
    const limit = parseInt(String(query?.get("limit"))) || 15;

    // Ensure valid inputs
    RequestError.abortIf(page < 1 || limit < 1, "Page and limit must be positive integers", 400);

    // Convert to Prisma pagination parameters
    const take = limit;
    const skip = (page - 1) * limit;
    const meta = (total: number, count: number) => ({
      perPage: limit,
      total,
      from: total > 0 ? skip + 1 : 0,
      to: Math.min(skip + count, total),
    });

    return { take, skip, meta };
  }
}
