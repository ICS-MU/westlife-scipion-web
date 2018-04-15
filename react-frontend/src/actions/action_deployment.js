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

export const listPastDeployments = (offset, limit, filterTerm = '') => async (dispatch) => {
  const running = false

  return dispatch({
    type: DEPLOYMENT.LIST.PAST,
    payload: {
      promise: (async () => {
        return await api().deployment.list(offset, limit, running, filterTerm)
      })()
    }
  })
}

export const retrieveDeployment = (deploymentId, running) => async (dispatch) => {
  return dispatch({
    type: DEPLOYMENT.RETRIEVE,
    payload: {
      promise: (async () => {
        const response = await api().deployment.retrieve(deploymentId, running)
        return _.get(response, 'deployment', {}) 
      })()
    }
  })
}

export const retrieveLog = (deploymentId) => {
  return api().deployment.retrieveLog(deploymentId)
}

export const createDeployment = (data) => async (dispatch) => {
  return dispatch({
    type: DEPLOYMENT.CREATE,
    payload: {
      promise: (async () => {
        const response = await api().deployment.create(data)
        return _.get(response, 'deployment', {})
      })()
    }
  })
}

export const modifyDeployment = (deploymentId, data) => async (dispatch) => {
  return dispatch({
    type: DEPLOYMENT.MODIFY,
    payload: {
      promise: (async () => {
        const response = await api().deployment.modify(deploymentId, data)
        return _.get(response, 'deployment', {})
      })()
    }
  })
}

export const undeployDeployment = (deploymentId) => async (dispatch) => {
  return dispatch({
    type: DEPLOYMENT.UNDEPLOY,
    payload: {
      promise: (async () => {
        const response = await api().deployment.undeploy(deploymentId)
        return _.get(response, 'deployment', {})
      })()
    }
  })
}

export const deletePastDeployment = (deploymentId) => async (dispatch) => {
  return dispatch({
    type: DEPLOYMENT.DELETE,
    payload: {
      promise: (async () => {
        await api().deployment.delete(deploymentId)
        return { id: deploymentId }
      })
    }
  })
}

