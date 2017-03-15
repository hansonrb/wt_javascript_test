//@flow
import React, { PropTypes as pt } from 'react'
import { Container, Header, Company } from './CompaniesStyle'

const Companies = React.createClass({
  propTypes: {
    getCompanies: pt.func.isRequired,
    companies: pt.arrayOf(pt.object).isRequired
  },

  componentDidMount() {
    this.props.getCompanies()
  },

  render() {
    const { companies } = this.props

    return <Container>
      <Header>Companies</Header>
      {companies.map(c =>
        <Company key={c.id}>{c.name}</Company>
      )}
    </Container>
  }
})

export default Companies
