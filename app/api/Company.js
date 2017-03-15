//@flow
import { routes } from '~/app/config'
import { apiGet } from '~/app/api/__helpers'

export function getCompanies() {
  return apiGet(routes.companies.index)
}
