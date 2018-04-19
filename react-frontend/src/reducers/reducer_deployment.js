import _ from 'lodash'
import { DEPLOYMENT } from '../constants'

const initialState = {
  running: {
    isFulfilled: false,
    data: []
  },
  past: {
    isFulfilled: false,
    currentOffset: 0,
    hasMoreItems: true,
    data: []
  }
}

export default function deploymentUpdate(state = initialState, { type, payload }) {
  switch(type) {
    case `${DEPLOYMENT.LIST.RUNNING}_FULFILLED`:
    case DEPLOYMENT.LIST.RUNNING:
      return {
        ...state,
        running: {
          isFulfilled: true,
          data: payload
        }
      }
    case `${DEPLOYMENT.LIST.PAST}_FULFILLED`:
      const { selection_params, deployments } = payload
      const stateCommon = {
        isFulfilled: true,
        currentOffset: selection_params.offset,
        hasMoreItems: deployments.length === DEPLOYMENT.LIST.LOADING_LIMIT
      }
      if(selection_params.offset === 0) {
        return {
          ...state,
          past: {
            ...stateCommon,
            data: deployments
          }
        }
      }
      return {
        ...state,
        past: {
          ...stateCommon,
          data: [ ...state.past.data, ...deployments ]
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
    case `${DEPLOYMENT.CREATE}_FULFILLED`:
      return {
        ...state,
        running: {
          ...state.running,
          data: [ payload, ...state.running.data ]
        }
      }
    case `${DEPLOYMENT.MODIFY}_FULFILLED`:
      return {
        ...state,
        running: {
          ...state.running,
          data: _.map(state.running.data, (deployment) => {
            return deployment.id === payload.id ? payload : deployment
          })
        }
      }
    case `${DEPLOYMENT.UNDEPLOY}_FULFILLED`:
      return {
        ...state,
        running: {
          ...state.running,
          data: _.reject(state.running.data, { id: payload.id })
        },
        past: {
          ...state.past,
          data: [ payload, ...state.past.data ]
        }
      }
    case `${DEPLOYMENT.DELETE}_FULFILLED`:
      return {
        ...state,
        past: {
          ...state.past,
          data: _.reject(state.past.data, { id: payload.id })
        }
      }
    default:
      return state
  }
}