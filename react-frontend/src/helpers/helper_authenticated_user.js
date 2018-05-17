import store from '../store'

const { getState } = store

/*
 * Check's if user is logged in
 *
 * @return  {boolean}   True, if user is logged in, otherwise false
 */
export const isLoggedIn = () => getState().authenticatedUser.token !== ''

/*
 * Get authenticated user's token
 *
 * @return  {string}    Authenticated user's token
 */
export const token = () => getState().authenticatedUser.token