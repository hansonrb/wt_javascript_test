//@flow
import React, { PropTypes as pt } from 'react'
import { browserHistory } from 'react-router'
import { Container, Header } from './CompaniesStyle'
import CompanyForm from './CompanyForm'


const NewCompany = React.createClass({
  propTypes: {
    addCompany: pt.func.isRequired
  },

  handleSubmit(data) {
    this.props.addCompany({ company: data })
    browserHistory.push('/companies')
  },

  render() {
    return <Container>
      <Header>New Company</Header>
      <CompanyForm onSubmit={data => this.handleSubmit(data)} />
    </Container>
  }
})

export default NewCompany
