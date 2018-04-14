import _ from 'lodash'
import { api } from '../api'
import { TEMPLATE } from '../constants'

export const listTemplates = () => async (dispatch) => {
  return dispatch({
    type: TEMPLATE.LIST,
    payload: {
      promise: (async () => {
        const response = await api().template.list()
        return _.get(response, 'templates', [])
      })()
    }
  })
}
