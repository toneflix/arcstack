import { JsonResource, Resource } from '@core/JsonApiResource';

import UserResource from './UserResource';

/**
 * UserCollection
 */
export default class extends JsonResource {
    /**
     * Build the response object
     * @returns this
     */
    data () {
        const data = Array.isArray(this.resource) ? this.resource : this.resource.data

        return {
            data: data.map(
                (e: Resource) => new UserResource(this.request, this.response, e).data()
            )
        }
    }
}
