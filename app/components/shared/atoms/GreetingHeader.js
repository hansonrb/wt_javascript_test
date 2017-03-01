//@flow
import React, { PropTypes as pt } from 'react'
import { Greeting, Text } from './GreetingHeaderStyle'

const GreetingHeader = React.createClass({
  propTypes: {
    greeting: pt.string.isRequired,
    text: pt.string.isRequired
  },

  render() {
    const { greeting, text } = this.props

    return <div>
      <Greeting>{ greeting }</Greeting>
      <Text>{ text.replace('. ', '.\n') }</Text>
    </div>
  }
})

export default GreetingHeader
