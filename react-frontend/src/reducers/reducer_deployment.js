import _ from 'lodash'
import { DEPLOYMENT } from '../constants'

const initialState = {
  running: {
    isFulfilled: false,
    data: []
  },
  past: {
    isFulfilled: false,
    data: []
  }
}

export default function deploymentUpdate(state = initialState, { type, payload }) {
  switch(type) {
    case `${DEPLOYMENT.LIST.RUNNING}_FULFILLED`:
      return {
        ...state,
        running: {
          isFulfilled: true,
          data: payload
        }
      }
    case `${DEPLOYMENT.RETRIEVE}_FULFILLED`:
      const storedDeployment = _.find(state.running.data, { id: payload.id })
      if(_.isEqual(storedDeployment, payload)) {
        return state
      }

      if(_.find(state.running.data, { id: payload.id })) {
        return {
          ...state,
          running: {
            ...state.running,
            data: _.map(state.running.data, (deployment) => {
              return deployment.id === payload.id ? payload : deployment
            })
          }
        }
      } else {
        return {
          ...state,
          running: {
            ...state.running,
            data: [ payload, ...state.running.data ]
          }
        }
      }
    default:
      return state
  }
}