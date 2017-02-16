//@flow
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'

import Portal from '~/app/containers/pages/portal/Portal'
import Layout from '~/app/containers/pages/layout/Layout'
import store from '~/app/Store'
import './assets/styles/global.css'

render((
  <Provider store={store}>
    <div style={{height: '100%'}}>
      <Router history={browserHistory}>
        <Route path='/' component={Layout}>
          <IndexRoute component={Portal} />
        </Route>
      </Router>
    </div>
  </Provider>
), document.getElementById('root'))
