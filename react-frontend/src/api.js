import axios from 'axios'
import _ from 'lodash'

import store from './store'
import { token } from './helpers/helper_authenticated_user'
import { logout } from './actions/action_authenticated_user'
import { showError } from './actions/action_notification'

//development TODO: delete on production
export const BASE_API_URL = 'http://127.0.0.1:5000/api'
//export const BASE_API_URL = `${window.location.protocol}//${window.location.hostname}/api`

axios.defaults.baseURL = BASE_API_URL;
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const responseSuccessHandler = (response) => response.data || {}

const responseErrorHandler = (error) => {
  store.dispatch(showError(_.get(error, 'response.data.message', 'Something went wrong')))

  if(_.get(error, 'response.status') === 401) {
    store.dispatch(logout())
  }

  throw error
}

const requestFactory = (method, url, body = {}, useToken = true, ownToken = '') => {
  const config = {
    headers: {}
  }

  if(useToken) {
    let bearerToken = ownToken || token()
    config.headers['Authorization'] = `Bearer ${bearerToken}`
  }

  config.method = method.toString().toLowerCase()
  if(Object.keys(body).length > 0) {
    if(config.method === 'get') {
      config.params = body
    }
    if(config.method === 'post' || config.method === 'patch') {
      config.data = body
    }
  }

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler)
}

export function api() {
  return {
    user: {
      me(token = '') {
        let args = ['get', '/users/me', {}, true]
        if(token) {
          args = [...args, token]
        }
        return requestFactory(...args)
      }
    },
    deployment: {
      list(offset = 0, limit = 20, running = true, filter = '') {
        return requestFactory('get', '/deployments', { offset, limit, running, filter })
      },
      retrieve(deploymentId, running = false) {
        return requestFactory('get', `/deployments/${deploymentId}`, { running })
      },
      retrieveLog(deploymentId) {
        return requestFactory('get', `/deployments/${deploymentId}/log`)
      },
      create(data) {
        return requestFactory('post', '/deployments', data)
      },
      modify(deploymentId, data) {
        return requestFactory('patch', `/deployments/${deploymentId}`, data)
      },
      undeploy(deploymentId) {
        return requestFactory('patch', `/deployments/${deploymentId}/undeploy`)
      },
      delete(deploymentId) {
        return requestFactory('delete', `/deployments/${deploymentId}`)
      }
    },
    template: {
      list() {
        return requestFactory('get', '/templates')
      }
    },
    development: {
      login() {
        return requestFactory('get', '/development/authenticate')
      }
    }
  }
}