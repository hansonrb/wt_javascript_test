// @flow
import portalSagas from '~/app/sagas/portal'

export default function* rootSaga(): Generator<any,any,any> {
  yield [
    ...portalSagas
  ]
}
