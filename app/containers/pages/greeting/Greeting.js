//@flow
import { connect } from 'react-redux'
import Greeting from '~/app/components/pages/greeting/Greeting'
import { createAction } from 'redux-actions'
import { SAGA_GET_PROJECT } from '~/app/reducers/Greeting'

export const mapStateToProps = (state: Object): Object => ({
  project: state.greeting.project
})

export const mapDispatchToProps = (dispatch: Function): Object => ({
  getProject: (id: number) => dispatch(createAction(SAGA_GET_PROJECT)({id}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Greeting)
