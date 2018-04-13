import _ from 'lodash'
import { DEPLOYMENT } from '../constants'

const initialState = {
  running: {
    isFulfilled: false,
    data: [],
    error: ''
  },
  past: {
    isFulfilled: false,
    data: []
  }
}

export default function deploymentUpdate(state = initialState, { type, payload }) {
  switch(type) {
    case `${DEPLOYMENT.RETRIEVE}_PENDING`:
      return {
        ...state,
        running: {
          ...state.running,
          error: ''
        }
      }
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

      if(_.includes(DEPLOYMENT.STATUS.RUNNING, payload.status)) {
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
      } else {
        return {
          ...state,
          running: {
            ...state.running,
            error: "It's not possible to show past deployment"
          }
        }
      }
    default:
      return state
  }
}