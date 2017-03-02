//@flow
import React, { PropTypes as pt } from 'react'
import { range, findKey } from 'lodash'
import { Header, Main, Description } from './HeaderStyle'

const GreetingHeader = React.createClass({
  propTypes: {
    description: pt.string.isRequired
  },

  greetingBasedOnTime() {
    const greetings = {
      'Good Morning!': range(5, 13),
      'Good Afternoon!': range(12, 18),
      'Good Evening!': range(17, 24).concat(range(0, 5))
    }

    return findKey(greetings, hours => hours.includes(new Date().getHours()))
  },

  render() {
    const { description } = this.props

    return <Header>
      <Main>{ this.greetingBasedOnTime() }</Main>
      <Description>{ description.replace('. ', '.\n') }</Description>
    </Header>
  }
})

export default GreetingHeader
