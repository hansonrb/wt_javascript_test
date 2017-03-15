// @flow
import type Action from '~/app/Types'
import update from 'immutability-helper'

export const SET_COMPANIES = 'company/SET_COMPANIES'
export const SAGA_GET_COMPANIES = 'company/SAGA_GET_COMPANIES'

const initialState = {
  companies: []
}

export default function reducer(state: Object = initialState, action: Action) {
  const p = action.payload
  switch (action.type) {
    case SET_COMPANIES:
      return update(state, {companies: {$set: p.companies}})
    default:
      return state
  }
}
