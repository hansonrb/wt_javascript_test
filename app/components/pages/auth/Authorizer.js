//@flow
import React, { PropTypes as pt } from 'react'
import { browserHistory } from 'react-router'
import Acl from '~/app/components/pages/auth/Acl'
import _ from 'lodash'

const Authorizer = React.createClass({
  propTypes: {
    Component: pt.oneOfType([pt.element, pt.func]).isRequired,
    user: pt.object.isRequired
  },

  componentWillMount() { this.authorize() },
  componentDidUpdate() { this.authorize() },

  authorize() {
    const { Component } = this.props

    if (!this.isAuthorized()) {
      browserHistory.push('/not_authorized')
    }
  },

  isAuthorized() {
    const { user, Component } = this.props
    const componentName = Component.WrappedComponent.displayName
    const authorizer = Acl[componentName]
    return authorizer(user)
  },

  render() {
    const { Component } = this.props

    if (this.isAuthorized()) {
      return <Component {..._.omit(this.props, ['user', 'Component'])} />
    }
    return null
  }
})

export default Authorizer
