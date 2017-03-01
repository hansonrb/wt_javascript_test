//@flow
import React, { PropTypes as pt } from 'react'
import { GreetingHeader } from '~/app/components/shared/atoms'
import { ActionButton } from '~/app/components/shared/molecules'
import { TopContainer, BottomContainer } from './GreetingStyle'

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

    return <TopContainer>
      <GreetingHeader
        greeting='Good morning!'
        text="You've been directed here to act on an RFP for Durham School Service.
              3 out of 6 carriers have submitted bids." />

      <BottomContainer>
        <ActionButton text='register' />
        What's in it for me?
        <ActionButton text='sign in' />
      </BottomContainer>
    </TopContainer>
  }
})

export default Greeting
