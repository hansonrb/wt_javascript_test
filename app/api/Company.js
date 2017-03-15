//@flow
import { routes } from '~/app/config'
import { apiGet, apiPost } from '~/app/api/__helpers'

export function getCompanies() {
  return apiGet(routes.companies.index)
}

export function createCompany(payload: any) {
  return apiPost(routes.companies.create, payload)
}
