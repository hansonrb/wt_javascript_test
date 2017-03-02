//@flow
import React, { PropTypes as pt } from 'react'
import { ToolTipBox } from './ToolTipStyle'

const ToolTip = React.createClass({
  propTypes: {
    text: pt.string.isRequired
  },

  render() {
    const { text } = this.props

    return <ToolTipBox>
      { text }
    </ToolTipBox>
  }
})

export default ToolTip
