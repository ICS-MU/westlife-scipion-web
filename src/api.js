import axios from 'axios'
import _ from 'lodash'

import store from './store'
import { token } from './helpers/helper_authenticated_user'
import { logout } from './actions/action_authenticated_user'
import { showError } from './actions/action_notification'

export const BASE_API_URL = 'https://api-dev.scipion.ics.muni.cz/api'

axios.defaults.baseURL = BASE_API_URL;
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const responseSuccessHandler = (response) => response.data || {}

const responseErrorHandler = (error) => {
  store.dispatch(showError(_.get(error, 'response.msg', 'Something went wrong')))

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
      running: {
        list() {
          return requestFactory('get', '/deployments/running')
        }
      }
    }
  }
}