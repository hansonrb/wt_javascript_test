//@flow
import watchGetCompanies from '~/app/sagas/company/GetCompanies'
import watchCreateCompany from '~/app/sagas/company/CreateCompany'

const sagas = [
  watchGetCompanies(),
  watchCreateCompany()
]

export default sagas
