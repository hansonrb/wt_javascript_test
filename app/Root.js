//@flow
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Redirect } from 'react-router'
import { Provider } from 'react-redux'

import Companies from '~/app/containers/pages/companies/Companies'
import Layout from '~/app/containers/pages/layout/Layout'
import store from '~/app/Store'
import './assets/styles/global.css'

render((
  <Provider store={store}>
    <div style={{height: '100%'}}>
      <Router history={browserHistory}>
        <Redirect from='/' to='/companies' />
        <Route path='/' component={Layout}>
          <Router path='companies' component={Companies} />
        </Route>
      </Router>
    </div>
  </Provider>
), document.getElementById('root'))
