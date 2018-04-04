import _ from 'lodash'
import { DEPLOYMENT } from '../constants'

const initialState = {
  running: {
    isFulfilled: false,
    data: {}
  },
  past: {
    isFulfilled: false,
    data: {}
  }
}

export default function deploymentUpdate(state = initialState, { type, payload }) {
  switch(type) {
    case `${DEPLOYMENT.LIST.RUNNING}_FULFILLED`:
      return {
        ...state,
        running: {
          isFulfilled: true,
          data: _.mapKeys(payload, 'id')
        }
      }
    case `${DEPLOYMENT.RETRIEVE}_FULFILLED`:
      const storedDeployment = _.get(state, `running.data.${payload.id}`, {})
      if(_.isEqual(storedDeployment, payload)) {
        return state
      } 

      return {
        ...state,
        running: {
          ...state.running,
          data: {
            ...state.running.data,
            [payload.id]: payload
          }
        }
      }
    default:
      return state
  }
}