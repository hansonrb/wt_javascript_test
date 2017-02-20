//@flow
import { connect } from 'react-redux'
import Portal from '~/app/components/pages/portal/Portal'
import { createAction } from 'redux-actions'
import { SAGA_GET_PROJECT } from '~/app/reducers/Portal'

export const mapStateToProps = (state: Object): Object => ({
  project: state.portal.project,
  right_pane_width: state.view.right_pane_width
})

export const mapDispatchToProps = (dispatch: Function): Object => ({
  getProject: (id: number) => dispatch(createAction(SAGA_GET_PROJECT)({id}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Portal)
