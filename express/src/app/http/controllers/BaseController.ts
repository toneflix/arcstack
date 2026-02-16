import { RequestError } from '@core/utils/errors'

import { Request } from 'express'
import { type InitialRules } from 'simple-body-validator'
import { validate, validateAsync } from '@core/utils/validator'

export default class {
  request?: Request | undefined

  constructor(req?: Request) {
    this.request = req
  }

  validate<X extends InitialRules>(req: Request, rules: X) {
    return validate(req.body, rules)
  }

  validateAsync<X extends InitialRules>(req: Request, rules: X) {
    return validateAsync(req.body, rules)
  }

  pagination(req?: Request) {
    this.request = req

    // Get page and limit from query parameters, with defaults
    const page = parseInt(String(this.request?.query?.page)) || 1
    const limit = parseInt(String(this.request?.query?.limit)) || 15

    // Ensure valid inputs
    RequestError.abortIf(page < 1 || limit < 1, 'Page and limit must be positive integers', 400)

    // Convert to Prisma pagination parameters
    const take = limit
    const skip = (page - 1) * limit
    const meta = (total: number, count: number) => ({
      perPage: limit,
      total,
      from: total > 0 ? skip + 1 : 0,
      to: Math.min(skip + count, total),
    })

    return { take, skip, meta }
  }
}
