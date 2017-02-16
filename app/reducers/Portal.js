// @flow
import type Action from '~/app/Types'
import update from 'immutability-helper'

export const SET_PROJECT = 'portal/SET_PROJECT'
export const SAGA_GET_PROJECT = 'portal/SAGA_GET_PROJECT'

const initialState = {
  project: {}
}

export default function reducer(state: Object = initialState, action: Action) {
  const p = action.payload
  switch (action.type) {
    case SET_PROJECT:
      return update(state, {project: {$set: p.project}})
    default:
      return state
  }
}
