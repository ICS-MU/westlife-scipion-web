import { USER } from '../constants'

const initialState = {
  token: '',
  data: null,
  isLoading: false
}

export default function authenticatedUserUpdate(state = initialState, { type, payload }) {
  console.log(state)
  switch(type) {
    case USER.AUTH.LOGGED_IN: {
      const { token, ...data } = payload
      return { 
        token, 
        data
      }
    }
    case USER.AUTH.LOGGED_OUT: 
      return initialState
    default:
      return state
  }
}