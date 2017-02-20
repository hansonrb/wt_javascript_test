// @flow
import update from 'immutability-helper'
import type Action from '~/app/Types'

export const SAGA_LOGIN = 'auth/SAGA_LOGIN'
export const SAGA_LOGOUT = 'auth/SAGA_LOGOUT'
export const SAGA_AUTHENTICATE = 'auth/SAGA_AUTHENTICATE'
export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER'

const initialState = {
  currentUser: {}
}

export default function reducer(state: Object = initialState, action: Action) {
  const p = action.payload
  switch (action.type) {
    case SET_CURRENT_USER:
      return update(state, {currentUser: {$set: p.user}})
    default:
      return state
  }
}
