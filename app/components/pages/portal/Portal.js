//@flow
import React, { PropTypes as pt } from 'react'
import SplitPane from 'react-split-pane'
import { Container } from './PortalStyle'

const Portal = React.createClass({
  propTypes: {
    getProject: pt.func.isRequired,
    project: pt.object.isRequired,
    right_pane_width: pt.oneOfType([pt.string, pt.number]).isRequired
  },

  componentDidMount() {
    this.props.getProject()
  },

  render() {
    const { right_pane_width } = this.props

    return <Container>
      <SplitPane split='vertical' defaultSize={right_pane_width}>
        <div>pane left</div>
        <div>pane right</div>
      </SplitPane>
    </Container>
  }
})

export default Portal
// defaultSize={layout.plan}
//         onChange={setTempLayoutWidth}
//         onDragFinished={setLayoutType}
