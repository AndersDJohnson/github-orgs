import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

import DevTools from './DevTools'
import { fetchReducer } from './fetch-actions'

export default function configureStore() {
  const reducers = combineReducers({
    routing: routerReducer,
    github: fetchReducer
  })

  const middleware = applyMiddleware(
      thunk,
      routerMiddleware(browserHistory)
  )

  const enhancer = compose(
    // Middleware you want to use in development:
    middleware,
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument()
  )

  // const store = createStore(reducers, middleware)
  const store = createStore(reducers, enhancer)

  return store
}
