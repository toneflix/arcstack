import { JsonResource } from '@core/JsonApiResource';

/**
 * UserResource
 */
export default class extends JsonResource {
    /**
     * Build the response object
     * @returns this
     */
    data () {
        return this.resource
    }
}
