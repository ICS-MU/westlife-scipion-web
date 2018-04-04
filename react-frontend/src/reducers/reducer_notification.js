import { NOTIFICATION } from '../constants'

const initialState = {
  errorMsg: null,
  successMsg: null,
  successPath: null
}

export default function notificationUpdate(state = initialState, { type, payload }) {
  switch(type) {
    case NOTIFICATION.SUCCESS.SHOW:
      return {
        ...state,
        successMsg: payload.msg,
        successPath: payload.path
      }
    case NOTIFICATION.SUCCESS.HIDE:
      return {
        ...state,
        successPath: null,
        successMsg: null
      }
    case NOTIFICATION.ERROR.SHOW:
      return {
        ...state,
        errorMsg: payload.msg
      } 
    case NOTIFICATION.ERROR.HIDE:
      return {
        ...state,
        errorMsg: null
      }
    default:
      return state
  }
}