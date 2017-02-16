export const api = {
  url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1' : 'http://edge.watchtowerbenefits.com/api/v1',
  x_api_key: 'aYIzOkTNpM9PeCe8bkFt44EiH19g7lrc76l01owi',
  x_api_authtoken: 'a98e8fad017a5d7b28fe43b4f691a0f2b586ee4e42dce22257181c71b3c0129a0656c107667fbe597227ecc3b68b2d4046237e714b26b24260458be12d43a4b5'
}

export const notaviewer = {
  api_url: 'https://nota-api.herokuapp.com',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbGFuZ3VhZ2UuYWkiLCJhdWQiOiJXTWo5V0t2aGtuZFFhVkZlR0VzQUM4SGFvM0xKb3lvTCIsImlhdCI6MTQ0MjU4NTcyNSwiZXhwIjoxNDkyNTg1NzI1LCJqdGkiOiJub3Rhc2Fhc2MxMjAxNjA1MDEiLCJkIjp7ImRlYnVnIjp0cnVlLCJhZG1pbiI6ZmFsc2UsInVpZCI6Ii1LR0pSOUttbDVsMTdRblJwMUU1IiwiZ3JvdXAiOiJ3YXRjaHRvd2VyIn0sInYiOjB9.GeYHKenRoVuSidzy1zflDpSjau_HZ4qPE-plgGDOzos',
  project: {
    id: '-KOscsJ5i1-7aSullPd1',
    documents: {
      reliance: '057cb32b-9baa-4ee3-ac12-d92b9e6fa785',
      unum: '090d2bac-56d4-4226-95ad-863058019b21',
      lycee: '5ebf342e-352e-4df5-a67f-d51ac074d191'
    }
  }
}

export const routes = {
  carriers: {
    // index: '/carriers',
    // attribute_order: (id) => `/carriers/${id}/attribute_order`
  },
  product_types: {
    // index: '/product_types'
  },
  sources: {
    // member: (id) => `/sources/${id}`
  },
  projects: {
    member: (id) => `/projects/${id}`
    // inforce: (id) => `/projects/${id}/in-force`
  },
  documents: {
    // types: '/documents/types',
    // member: (id) => `/documents/${id}`,
    // products: {
    //   index: (id) => `/documents/${id}/products`
    // }
  },
  products: {
    // member: (id) => `/products/${id}`,
    // product_classes: (product_id) => `/products/${product_id}/product_classes`,
    // match_current: (product_id) => `/products/${product_id}/match_current`
  },
  product_classes: {
    // member: (id) => `/product_classes/${id}`,
    // clone_class: (id) => `/product_classes/${id}/clone_class`,
    // match_current: (id) => `/product_classes/${id}/match_current`
  },
  dynamic_values: {
    // member: (id) => `/dynamic_values/${id}`,
    // clone_request: (id) => `/dynamic_values/${id}/clone_request`,
    // match_current: (id) => `/dynamic_values/${id}/match_current`
  }
}

const config = { api, routes, notaviewer }
export default config
