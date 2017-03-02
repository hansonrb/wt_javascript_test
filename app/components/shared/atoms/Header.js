//@flow
import React, { PropTypes as pt } from 'react'
import { Header, Main, Description } from './HeaderStyle'

const GreetingHeader = React.createClass({
  propTypes: {
    main: pt.string.isRequired,
    description: pt.string.isRequired
  },

  render() {
    const { main, description } = this.props

    return <Header>
      <Main>{ main }</Main>
      <Description>{ description.replace('. ', '.\n') }</Description>
    </Header>
  }
})

export default GreetingHeader
