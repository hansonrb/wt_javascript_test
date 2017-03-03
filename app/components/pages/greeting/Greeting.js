//@flow
import React, { PropTypes as pt } from 'react'
import { Header, ToolTip, Texts as txt } from '~/app/components/shared/atoms'
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

  getInitialState() {
    return {
      tooltipVisible: false
    }
  },

  componentDidMount() {
    const { getProject } = this.props
    getProject(parseInt(127, 10))
  },

  toggleTooltip() {
    this.setState((previous) => ({
      tooltipVisible: !previous.tooltipVisible
    }))
  },

  render() {
    const { project } = this.props
    const { tooltipVisible } = this.state

    console.log(project)

    return <Container>
      <SubContainer width={'100%'} minHeight={'200px'}>
        <Header
          main={txt.greetingHeader()}
          description={txt.greetingDescription()} />
      </SubContainer>

      <SubContainer padding={'0 2% 0 20%'}>
        <ActionButton text='REGISTER' action clickAction={() => null} />
      </SubContainer>

      <SubContainer padding={'0 20% 0 2%'}>
        <ActionButton text='SIGN IN' clickAction={() => null} />
      </SubContainer>

      <SubContainer padding={'0 2% 0 20%'}>
        <ActionButton
          text="What's in it for me?"
          fontSize={18}
          asLink
          clickAction={this.toggleTooltip} />
        { tooltipVisible ?
          <ToolTip
            width={'55%'}
            text={txt.greetingToolTip()}
            visible={tooltipVisible} /> : null }
      </SubContainer>
    </Container>
  }
})

export default Greeting
