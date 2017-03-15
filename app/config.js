export const api = {
  url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'not intended for production use'
}

export const routes = {
  companies: {
    index: '/companies'
  }
}

const config = { api, routes }
export default config
