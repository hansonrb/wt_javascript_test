//@flow
import React, { PropTypes as pt } from 'react'
import { Button } from './ButtonStyle'

const ActionButton = React.createClass({
  propTypes: {
    text: pt.string.isRequired,
    action: pt.bool,
    asLink: pt.bool,
    fontSize: pt.number,
    fontWeight: pt.number
  },

  getDefaultProps() {
    return {
      action: false,
      asLink: false,
      fontSize: 20,
      fontWeight: 800
    }
  },

  render() {
    const { action, asLink, fontSize, fontWeight, text } = this.props

    return <Button
      action={action}
      asLink={asLink}
      fontSize={fontSize}
      fontWeight={fontWeight} >
      { text }
    </Button>
  }
})

export default ActionButton
