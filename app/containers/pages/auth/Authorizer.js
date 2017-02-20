//@flow
import { connect } from 'react-redux'
import Authorizer from '~/app/components/pages/auth/Authorizer'

const authorize = (Component: Object) => {
  const mapStateToProps = (state: Object): Object => ({
    Component,
    user: state.auth.currentUser
  })

  return connect(mapStateToProps, () => ({}))(Authorizer)
}

export default authorize
