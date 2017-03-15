// @flow
import companySagas from '~/app/sagas/company'

export default function* rootSaga(): Generator<any,any,any> {
  yield [
    ...companySagas
  ]
}
