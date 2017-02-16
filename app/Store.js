// @flow
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from '~/app/reducers'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import sagas from '~/app/sagas'

const sagaMiddleware = createSagaMiddleware()
const logger = createLogger({
  collapsed: true,
  actionTransformer: (action) => ({type: action.type, ...action.payload})
})

const enhancer = compose(applyMiddleware(sagaMiddleware, logger))
const store = createStore(reducer, undefined, enhancer)
sagaMiddleware.run(sagas, store.dispatch)

export default store
