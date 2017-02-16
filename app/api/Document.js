//@flow
import { routes } from '~/app/config'
import { apiGet } from '~/app/api/__helpers'

export function getProject(id: number) {
  return apiGet(routes.projects.member(id))
}
