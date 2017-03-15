//@flow
import React, { PropTypes as pt } from 'react'
import { Input } from './CompaniesStyle'

const InputElement = React.createClass({
  propTypes: {
    input: pt.object.isRequired,
    meta: pt.object.isRequired,
    error: pt.string
  },

  getDefaultProps() {
    return {
      error: null
    }
  },

  render() {
    const { input, meta: { error }, ...props } = this.props

    return <Input {...props} {...input} style={{
      borderColor: error ? '#ff0000' : '#337ab7'
    }} />
  }
})

export default InputElement
