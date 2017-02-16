//@flow
import React, { PropTypes as pt } from 'react'

const Layout = React.createClass({
  propTypes: {
    children: pt.element.isRequired
  },

  render() {
    return <div>
      {this.props.children}
    </div>
  }
})

export default Layout
