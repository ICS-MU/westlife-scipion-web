import { NOTIFICATION } from '../constants'

export const showSuccess = (msg, path = null) => dispatch => {
  dispatch({
    type: NOTIFICATION.SUCCESS.SHOW,
    payload: { msg, path }
  })
}

export const hideSuccess = () => dispatch => {
  dispatch({
    type: NOTIFICATION.SUCCESS.HIDE
  })
}

export const showError = (msg) => dispatch => {
  dispatch({
    type: NOTIFICATION.ERROR.SHOW,
    payload: { msg }
  })
}

export const hideError = () => dispatch => {
  dispatch({
    type: NOTIFICATION.ERROR.HIDE
  })
}
