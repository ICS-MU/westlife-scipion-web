import axios from 'axios'
import _ from 'lodash'

import store from './store'
import { token } from './helpers/helper_authenticated_user'
import { logout } from './actions/action_authenticated_user'
import { showError } from './actions/action_notification'

export const BASE_API_URL = process.env.NODE_ENV === 'production' ? 
  `${window.location.protocol}//${window.location.hostname}/api` :
  'http://127.0.0.1:5000/api'

axios.defaults.baseURL = BASE_API_URL;
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

/*
 * Response success handler returns data or empty object on success request
 *
 * @param   {object}  response  Response from the server
 * @return  {object}  Response data or empty object
 */
const responseSuccessHandler = (response) => response.data || {}

/*
 * Response error handler dispatches the error message to the redux state. It logouts
 * the user if the response status is 401.
 *
 * @param {object}  error Error response from the server
 * @throw {object}  error Error object
 */
const responseErrorHandler = (error) => {
  store.dispatch(showError(_.get(error, 'response.data.message', 'Connection failed')))

  if(_.get(error, 'response.status') === 401) {
    store.dispatch(logout())
  }

  throw error
}

/*
 * Api request factory, it makes an api call base on the given params
 *
 * @param   {string}    method    Request's method (GET, POST etc.)
 * @param   {string}    url       Request's url
 * @param   {object}    body      POST/PATCH data or GET params
 * @param   {boolean}   useToken  Specifies if token is used
 * @param   {string}    ownToken  Token to be used, otherwise it uses token from redux store
 * @return  {function}  Axios api call function, success/error handlers are called
 */
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

/*
 * Api calls functions
 */
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