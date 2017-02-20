//@flow
import React, { PropTypes as pt } from 'react'
import SplitPane from 'react-split-pane'
import { Container } from './PortalStyle'

const Portal = React.createClass({
  propTypes: {
    getProject: pt.func.isRequired,
    project: pt.object.isRequired,
    params: pt.shape({
      id: pt.any
    }).isRequired,
    right_pane_width: pt.oneOfType([pt.string, pt.number]).isRequired
  },

  componentDidMount() {
    const { getProject, params } = this.props
    getProject(parseInt(params.id, 10))
  },

  render() {
    const { right_pane_width, project } = this.props

    return <Container>
      <SplitPane split='vertical' defaultSize={right_pane_width}>
        <div>pane left
          {JSON.stringify(project)}
        </div>
        <div>pane right</div>
      </SplitPane>
    </Container>
  }
})

export default Portal
// defaultSize={layout.plan}
//         onChange={setTempLayoutWidth}
//         onDragFinished={setLayoutType}
