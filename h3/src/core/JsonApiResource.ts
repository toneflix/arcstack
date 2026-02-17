// oxlint-disable unicorn/no-thenable
// oxlint-disable typescript/no-explicit-any

import { H3Event } from "h3";

export interface Resource {
  [key: string]: any;
  pagination?:
  | {
    from?: number | undefined;
    to?: number | undefined;
    perPage?: number | undefined;
    total?: number | undefined;
  }
  | undefined;
}

type BodyResource = Resource & {
  data: Omit<Resource, "pagination">;
  meta?:
  | {
    pagination?: Resource["pagination"];
  }
  | undefined;
};

/**
 * Class to render API resource
 */
export class JsonResource<R extends Resource = any> {
  [key: string]: any;
  public resource: R;
  public event: H3Event;
  private body: BodyResource = { data: {} };

  constructor(event: H3Event, rsc: R) {
    this.event = event;
    this.resource = rsc;

    /* Copy properties from rsc */
    for (const key of Object.keys(rsc.data ?? rsc)) {
      if (!(key in this)) {
        Object.defineProperty(this, key, {
          enumerable: true,
          configurable: true,
          get: () => {
            return this.resource.data?.[key] ?? this.resource[key]
          },
          set: (value) => {
            if ((<any>this.resource).data && this.resource.data[key]) {
              this.resource.data[key] = value;
            } else {
              (<any>this.resource)[key] = value;
            }
          },
        })
      }
    }
  }

  /**
   * Return raw resource
   */
  data (): R {
    return this.resource;
  }

  /**
   * Build JSON structure
   */
  json () {
    const resource = this.data();

    let data: any = Array.isArray(resource) ? [...resource] : { ...resource };

    if (typeof data.data !== "undefined") {
      data = data.data;
    }

    if (!Array.isArray(resource)) {
      delete data.pagination;
    }

    this.body = { data };

    if (!Array.isArray(resource) && this.resource.pagination) {
      this.body.meta = {
        pagination: this.resource.pagination,
      };
    }

    return this;
  }

  /**
   * Convert resource to array
   *
   * @returns
   */
  toArray () {
    const resource = this.resource;
    let data: any = Array.isArray(resource) ? [...resource] : { ...resource };

    if (typeof data.data !== "undefined") {
      data = data.data;
    }

    return data;
  }

  /**
   * Merge additional fields
   */
  additional<X extends Record<string, any>> (extra: X) {
    delete extra.data;
    delete extra.pagination;

    this.body = {
      ...this.body,
      ...extra,
    };

    return this;
  }

  /**
   * Set response status
   */
  status (code: number) {
    this.event.res.status = code;
    return this;
  }

  /**
   * Make this instance Promise-like
   */
  then<TResult1 = BodyResource, TResult2 = never> (
    onfulfilled?: ((value: BodyResource) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.body).then(onfulfilled, onrejected);
  }
}

export function ApiResource (instance: JsonResource) {
  return instance;
}

export default function BaseResource<R extends Resource> (evt: H3Event, rsc: R) {
  return ApiResource(new JsonResource<R>(evt, rsc));
}
