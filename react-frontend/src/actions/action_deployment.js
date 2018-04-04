import _ from 'lodash'
import { api } from '../api'
import { DEPLOYMENT } from '../constants'

export const listRunningDeployments = () => async (dispatch) => {
  let offset = 0
  const limit = 50
  const running = true
  let tmpDeployments = []

  function fetchRunningDeploymentsPaginated(offset, limit) {
    return api().deployment.list(offset, limit, running)
  }

  function appendToTempList(data) {
    tmpDeployments = [ ...tmpDeployments, ...data ]
  }

  async function fetchAllData(ownOffset = offset) {
    const response = await fetchRunningDeploymentsPaginated(ownOffset, limit)
    if(response) {
      const data = _.get(response, 'deployments', [])
      const lastPage = data.length === 0

      appendToTempList(data)

      if(!lastPage) {
        return fetchAllData(ownOffset += limit)
      }
    }
    return response
  }

  return dispatch({
    type: DEPLOYMENT.LIST.RUNNING,
    payload: {
      promise: (async () => {
        await fetchAllData()
        return tmpDeployments
      })()
    }
  })
}

export const retrieveRunningDeployment = (deployment_id) => async (dispatch) => {
  return dispatch({
    type: DEPLOYMENT.RETRIEVE,
    payload: {
      promise: (async () => {
        const response = await api().deployment.retrieve(deployment_id)
        return _.get(response, 'deployment', {}) 
      })()
    }
  })
}
