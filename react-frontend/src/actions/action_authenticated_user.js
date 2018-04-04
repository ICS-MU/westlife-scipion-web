import _ from 'lodash'
import { api } from '../api'
import { USER } from '../constants'

export const login = (token) => async(dispatch) => {
  const { me } = await api().user.me(token)  

  dispatch({
    type: USER.AUTH.LOGGED_IN,
    payload: {
      ...me,
      token
    }
  })
}

export const logout = () => dispatch => {
  dispatch({
    type: USER.AUTH.LOGGED_OUT
  })
}

// development login
export const loginDev = () => async(dispatch) => {
  const response = await api().development.login()
  const token = _.get(response, 'token', '')

  if(token) {
    const { me } = await api().user.me(token)
    
    dispatch({
      type: USER.AUTH.LOGGED_IN,
      payload: {
        ...me,
        token
      }
    })
  }

  return response
}
