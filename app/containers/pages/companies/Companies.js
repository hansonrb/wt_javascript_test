//@flow
import { connect } from 'react-redux'
import Companies from '~/app/components/pages/companies/Companies'
import { createAction } from 'redux-actions'
import { SAGA_GET_COMPANIES } from '~/app/reducers/Company'

export const mapStateToProps = (state: Object): Object => ({
  companies: state.company.companies,
})

export const mapDispatchToProps = (dispatch: Function): Object => ({
  getCompanies: () => dispatch(createAction(SAGA_GET_COMPANIES)())
})

export default connect(mapStateToProps, mapDispatchToProps)(Companies)
