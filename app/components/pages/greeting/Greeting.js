//@flow
import React, { PropTypes as pt } from 'react'
import { Header } from '~/app/components/shared/atoms'
import { ActionButton } from '~/app/components/shared/molecules'
import { Container, SubContainer } from './GreetingStyle'

const Greeting = React.createClass({
  propTypes: {
    getProject: pt.func.isRequired,
    project: pt.object.isRequired,
    params: pt.shape({
      id: pt.any
    }).isRequired
  },

  componentDidMount() {
    const { getProject } = this.props
    getProject(parseInt(127, 10))
  },

  render() {
    const { project } = this.props

    console.log(project)

    return <Container>
      <SubContainer width={'100%'} minHeight={'200px'}>
        <Header
          description="
            You've been directed here to act on an RFP for Durham School Service.
            3 out of 6 carriers have submitted bids.
          " />
      </SubContainer>

      <SubContainer padding={'0 2% 0 20%'}>
        <ActionButton text='REGISTER' action />
      </SubContainer>

      <SubContainer padding={'0 20% 0 2%'}>
        <ActionButton text='SIGN IN' />
      </SubContainer>

      <SubContainer padding={'0 2% 0 20%'}>
        <ActionButton text="What's in it for me?" asLink fontSize={18} />
      </SubContainer>
    </Container>
  }
})

export default Greeting
