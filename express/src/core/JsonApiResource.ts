// oxlint-disable typescript/no-explicit-any

import { Request, Response } from 'express'

export interface Resource {
  [key: string]: any
  pagination?:
    | {
        from?: number | undefined
        to?: number | undefined
        perPage?: number | undefined
        total?: number | undefined
      }
    | undefined
}

type BodyResource = Resource & {
  data: Omit<Resource, 'pagination'>
  meta?:
    | {
        pagination?: Resource['pagination']
      }
    | undefined
}

/**
 * Class to render API resource
 */
export class JsonResource<R extends Resource = any> {
  /**
   * The request instance
   */
  request: Request
  /**
   * The response instance
   */
  response: Response
  /**
   * The data to send to the client
   */
  resource: R
  /**
   * The final response data object
   */
  body: BodyResource = {
    data: {},
  }
  /**
   * Flag to track if response should be sent automatically
   */
  private shouldSend: boolean = false
  /**
   * Flag to track if response has been sent
   */

  private responseSent: boolean = false;

  /**
   * Declare that this includes R's properties
   */
  [key: string]: any

  /**
   * @param req The request instance
   * @param res The response instance
   * @param rsc The data to send to the client
   */
  constructor(req: Request, res: Response, rsc: R) {
    this.request = req
    this.response = res
    this.resource = rsc

    /* Copy properties from rsc */
    for (const key of Object.keys(rsc)) {
      if (!(key in this)) {
        Object.defineProperty(this, key, {
          enumerable: true,
          configurable: true,
          get: () => this.resource[key],
          set: (value) => {
            ;(<any>this.resource)[key] = value
          },
        })
      }
    }

    /* Return proxied instance */
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver)

        if (typeof value === 'function') {
          if (prop === 'json' || prop === 'additional') {
            return (...args: any[]) => {
              const result = (value as any).apply(target, args)

              setImmediate(() => target['checkSend']())

              return result
            }
          }

          if (prop === 'send') {
            return (...args: any[]) => {
              target['shouldSend'] = false
              return (value as any).apply(target, args)
            }
          }
        }

        return value
      },
    })
  }

  /**
   * Return the data in the expected format
   *
   * @returns
   */
  data(): Resource {
    return this.resource
  }

  /**
   * Build the response object
   * @returns this
   */
  json() {
    // Indicate response should be sent automatically
    this.shouldSend = true

    // Set default status code
    this.response.status(200)

    // Prepare body
    const resource = this.data()
    let data: Resource = Array.isArray(resource) ? [...resource] : { ...resource }

    if (typeof data.data !== 'undefined') {
      data = data.data
    }

    if (!Array.isArray(resource)) {
      delete data.pagination
    }

    this.body = {
      data,
    }

    // Set the pagination from the data() resource, if available
    if (!Array.isArray(resource) && resource.pagination) {
      const meta: BodyResource['meta'] = this.body.meta ?? {}
      meta.pagination = resource.pagination
      this.body.meta = meta
    }

    // If pagination is not available on the resource, then check and set it
    // if it's available on the base resource.
    if (this.resource.pagination && !this.body.meta?.pagination) {
      const meta: BodyResource['meta'] = this.body.meta ?? {}
      meta.pagination = this.resource.pagination
      this.body.meta = meta
    }

    return this
  }

  /**
   * Add context data to the response object
   * @param data Context data
   * @returns this
   */
  additional<X extends { [key: string]: any }>(data: X) {
    // Allow automatic send after additional
    this.shouldSend = true

    // Merge data with body
    delete data.data
    delete data.pagination

    this.body = {
      ...this.body,
      ...data,
    }

    return this
  }

  /**
   * Send the output to the client
   * @returns this
   */
  send() {
    this.shouldSend = false // Prevent automatic send
    if (!this.responseSent) {
      this.#send()
    }
    return this
  }

  /**
   * Set the status code for this response
   * @param code Status code
   * @returns this
   */
  status(code: number) {
    this.response.status(code)
    return this
  }

  /**
   * Private method to send the response
   */
  #send() {
    if (!this.responseSent) {
      this.response.json(this.body)

      // Mark response as sent
      this.responseSent = true
    }
  }

  /**
   * Check if send should be triggered automatically
   */
  private checkSend() {
    if (this.shouldSend && !this.responseSent) {
      this.#send()
    }
  }
}

export function ApiResource(instance: JsonResource) {
  return instance
}

export default function BaseResource<R extends Resource>(req: Request, res: Response, rsc: R) {
  return ApiResource(new JsonResource<R>(req, res, rsc))
}
