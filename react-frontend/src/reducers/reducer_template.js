import { TEMPLATE } from '../constants'
import _ from 'lodash'

export default function templatesUpdate(state = {}, { type, payload }) {
    switch(type) {
        case `${TEMPLATE.LIST}_FULFILLED`:
            return _.mapKeys(payload, 'id')
        default:
            return state
    }
}
