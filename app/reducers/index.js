// @flow
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import portal from '~/app/reducers/Portal'
import view from '~/app/reducers/View'

const RootReducer = combineReducers({
  portal,
  view,
  form: formReducer
})

export default RootReducer
