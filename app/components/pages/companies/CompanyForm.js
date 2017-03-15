//@flow
import React, { PropTypes as pt } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button, ErrorMessage } from './CompaniesStyle'
import InputElement from './InputElement'

const CompanyForm = React.createClass({
  propTypes: {
    handleSubmit: pt.func.isRequired,
    error: pt.object
  },

  getDefaultProps() {
    return {
      error: null
    }
  },

  componentDidMount() {

  },

  render() {
    const { handleSubmit, error } = this.props

    return (
      <form onSubmit={handleSubmit} style={{textAlign: 'center'}}>
        <Field
          name='name'
          component={InputElement}
          placeholder='Company Name: (required)' />
        <Button disabled={error}>Add</Button>
        <ErrorMessage>{error}</ErrorMessage>
      </form>
    )
  }
})

export default reduxForm({
  form: 'company/new',
  validate(values) {
    let errors = {}
    if (!values.name) {
      errors = {
        name: 'Name is required',
        _error: 'Name is required'
      }
    } else if (values.name.length < 3) {
      errors = {
        name: 'Name should be more than 3 letters',
        _error: 'Name should be more than 3 letters'
      }
    }

    return errors
  }
})(CompanyForm)
