// @flow
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import company from '~/app/reducers/Company'

const RootReducer = combineReducers({
  company,
  form: formReducer
})

export default RootReducer
