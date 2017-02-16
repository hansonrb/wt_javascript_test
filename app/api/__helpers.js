//@flow
import 'whatwg-fetch'
import { api } from '~/app/config'
import { MethodType } from '~/app/Types'

export function checkStatus(response: Object) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  return response.json()
    .then(r => {
      error.message = r.error
      return error
    })
    .catch(e => {
      error.message = 'Server Error'
      console.log(e)
      return error
    })
    .then(e => { throw e })
}

export function logResponse(response: Object) {
  console.log(response)
  return response
}

export function parseJSON(response: Object) {
  return response.text().then(text => {
    if (text === '') return new Promise((resolve,_reject) => { resolve({}) })
    const json = JSON.parse(text)
    return new Promise((resolve,_reject) => { resolve(json) })
  })
}

function request(path: string, payload: Object, method: MethodType) {
  const settings: Object = {
    method,
    headers: {
      'x-api-key': api.x_api_key,
      'X-API-AUTHTOKEN': api.x_api_authtoken,
      'Content-Type': 'application/json'
    }
  }
  if (method !== 'GET') { settings.body = JSON.stringify(payload) }
  return fetch(`${api.url}${path}`,settings)
    .then(checkStatus)
    .then(logResponse)
    .then(parseJSON)
    .catch(e => {
      if (e.response) throw e
      console.log(e)
      const error = new Error('Bad Connection')
      error.message = 'Check your internet connection'
      throw error
    })
}

export function apiGet(path: string, payload: Object = {}) {
  return request(path, payload, 'GET')
}

export function apiPost(path: string, payload: Object) {
  return request(path, payload, 'POST')
}

export function apiPut(path: string, payload: Object) {
  return request(path, payload, 'PUT')
}

export function apiDelete(path: string, payload: Object = {}) {
  return request(path, payload, 'DELETE')
}
