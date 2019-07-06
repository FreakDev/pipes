import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'


import rootReducer from './reducers'

import INITIAL_STATE from "./initial-state.json"

export default () => {
    const middlewares = [thunkMiddleware]
    const middlewareEnhancer = applyMiddleware(...middlewares)
  
    const enhancers = [middlewareEnhancer]
    const composedEnhancers = composeWithDevTools(...enhancers)

    return createStore(rootReducer, INITIAL_STATE, composedEnhancers)
} 