//@flow
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'

import Portal from '~/app/containers/pages/portal/Portal'
import Layout from '~/app/containers/pages/layout/Layout'
import store from '~/app/Store'
import authorize from '~/app/containers/pages/auth/Authorizer'
import './assets/styles/global.css'

render((
  <Provider store={store}>
    <div style={{height: '100%'}}>
      <Router history={browserHistory}>
        <Route path='/' component={Layout}>
          <IndexRoute component={authorize(Portal)} />
        </Route>
        <Route path='/not_authorized' component={() => <h1>Not Authorized</h1>} />
      </Router>
    </div>
  </Provider>
), document.getElementById('root'))
