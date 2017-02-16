// @flow
import type Action from '~/app/Types'
// import update from 'immutability-helper'

// export const SET_RIGHT_PANE_WIDTH = 'portal/SET_PROJECT'

const initialState = {
  right_pane_width: '35%'
}

export default function reducer(state: Object = initialState, action: Action) {
  // const p = action.payload
  switch (action.type) {
    // case SET_RIGHT_PANE_WIDTH:
    //   return update(state, {right_pane_width: {$set: p.width}})
    default:
      return state
  }
}
