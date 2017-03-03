//@flow
import React, { PropTypes as pt } from 'react'
import { ToolTipBox } from './ToolTipStyle'

const ToolTip = React.createClass({
  propTypes: {
    text: pt.string.isRequired,
    width: pt.string
  },

  getDefaultProps() {
    return {
      width: '300px'
    }
  },

  render() {
    const { width, text } = this.props

    return <ToolTipBox width={width}>
      { text }
    </ToolTipBox>
  }
})

export default ToolTip
