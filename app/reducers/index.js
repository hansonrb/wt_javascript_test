// @flow
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import portal from '~/app/reducers/Portal'
import view from '~/app/reducers/View'
import auth from '~/app/reducers/Auth'
import greeting from '~/app/reducers/Greeting'

const RootReducer = combineReducers({
  portal,
  view,
  auth,
  greeting,
  form: formReducer
})

export default RootReducer
