import { api } from '../api'
import { USER } from '../constants'

export const login = (token) => async(dispatch) => {
  const response = await api().user.me(token)
  const { name } = response

  dispatch({
    type: USER.AUTH.LOGGED_IN,
    payload: {
      name,
      token
    }
  })

  return response
}

export const logout = () => dispatch => {
  dispatch({
    type: USER.AUTH.LOGGED_OUT
  })
}
