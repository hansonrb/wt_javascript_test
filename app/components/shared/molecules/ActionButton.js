//@flow
import React, { PropTypes as pt } from 'react'
import { Button } from './ButtonStyle'

const ActionButton = React.createClass({
  propTypes: {
    text: pt.string.isRequired,
    clickAction: pt.func.isRequired,
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
    const { action, asLink, fontSize, fontWeight, text, clickAction } = this.props

    return <Button
      action={action}
      asLink={asLink}
      fontSize={fontSize}
      fontWeight={fontWeight}
      onClick={clickAction}>
      { text }
    </Button>
  }
})

export default ActionButton
