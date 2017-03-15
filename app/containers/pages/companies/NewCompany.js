//@flow
import { connect } from 'react-redux'
import NewCompany from '~/app/components/pages/companies/NewCompany'
import { createAction } from 'redux-actions'
import { SAGA_CREATE_COMPANY } from '~/app/reducers/Company'

export const mapStateToProps = (state: Object): Object => ({
  companies: state.company.companies,
})

export const mapDispatchToProps = (dispatch: Function): Object => ({
  addCompany: company => dispatch(createAction(SAGA_CREATE_COMPANY)(company))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewCompany)
