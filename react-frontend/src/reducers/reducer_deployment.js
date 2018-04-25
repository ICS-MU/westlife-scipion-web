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
    filterTerm: '',
    data: []
  }
}

export default function deploymentUpdate(state = initialState, { type, payload }) {
  const selection_params = _.get(payload, 'selection_params', {})
  const deployments = _.get(payload, 'deployments', [])
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
      const stateCommon = {
        isFulfilled: true,
        currentOffset: selection_params.offset,
        hasMoreItems: deployments.length === DEPLOYMENT.LIST.LOADING_LIMIT,
        filterTerm: selection_params.filter
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
    case DEPLOYMENT.LIST.PAST_REFRESH:
      if(state.past.filterTerm === selection_params.filter) {
        return {
          ...state,
          past: {
            ...state.past,
            data: _.unionWith(deployments, state.past.data, (newDpl, oldDpl) => {
              return newDpl.id === oldDpl.id
            })
          }
        }
      }
      return state
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