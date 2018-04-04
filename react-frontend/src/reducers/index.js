import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { loadingBarReducer } from 'react-redux-loading-bar'

import authenticatedUser from './reducer_authenticated_user'
import deployments from './reducer_deployment'
import notifications from './reducer_notification'

const rootReducer = combineReducers({
  authenticatedUser,
  deployments,
  notifications,
  form: formReducer,
  loadingBar: loadingBarReducer
})

export default rootReducer
