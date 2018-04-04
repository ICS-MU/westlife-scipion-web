import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import promiseMiddleware from 'redux-promise-middleware'

import reducers from './reducers'


const store = createStore(
  reducers,
  undefined,
  compose(
    applyMiddleware(promiseMiddleware(), thunkMiddleware, loadingBarMiddleware()),
    autoRehydrate()
  )
)

persistStore(store, { whitelist: ['authenticatedUser'] })

export default store
