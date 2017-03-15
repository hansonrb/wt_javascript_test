import { put, takeEvery } from 'redux-saga/effects'
import * as api from '~/app/api'
import { SAGA_GET_COMPANIES, SET_COMPANIES } from '~/app/reducers/Company'
import { createAction } from 'redux-actions'

function* perform(_action) {
  try {
    const companies = yield api.getCompanies()
    yield put(createAction(SET_COMPANIES)({companies}))
  } catch (err) { console.log(err) }
}

function* watch() {
  yield takeEvery(SAGA_GET_COMPANIES, perform)
}

export default watch
