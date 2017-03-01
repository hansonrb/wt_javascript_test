//@flow
import React, { PropTypes as pt } from 'react'

const ActionButton = React.createClass({
  propTypes: {
    text: pt.string.isRequired
  },

  render() {
    const { text } = this.props

    return <button>{ text }</button>
  }
})

export default ActionButton
