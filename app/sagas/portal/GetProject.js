import { put, takeEvery } from 'redux-saga/effects'
import * as api from '~/app/api'
import { SAGA_GET_PROJECT, SET_PROJECT } from '~/app/reducers/Portal'
import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import { project as schema } from '~/app/NormalizrSchemas'

function* perform() {
  try {
    let project = yield api.getProject(127)
    project.documents = project.documents.filter((d) => d.document_type === 'Policy' || d.carrier.name === 'Standard')
    project = normalize(project, schema)
    yield put(createAction(SET_PROJECT)({project}))
  } catch (err) { console.log(err) }
}

function* watch() {
  yield* takeEvery(SAGA_GET_PROJECT, perform)
}

export default watch
