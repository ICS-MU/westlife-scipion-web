import store from '../store'

const { getState } = store

export const isLoggedIn = () => getState().authenticatedUser.token !== ''
export const token = () => getState().authenticatedUser.token