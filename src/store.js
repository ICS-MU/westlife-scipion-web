import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducers from './reducers';

const middleware = [thunkMiddleware]

const store = createStore(
  reducers,
  undefined,
  compose(
    applyMiddleware(...middleware),
    autoRehydrate()
  )
)

persistStore(store, { whitelist: ['authenticatedUser'] })

export default store
