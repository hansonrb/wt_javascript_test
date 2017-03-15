//@flow
import React, { PropTypes as pt } from 'react'
import { Link } from 'react-router'
import { Container, Header, Company, Toolbar, Button } from './CompaniesStyle'

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
      <Toolbar>
        <Link to='/companies/new'><Button>Add Company</Button></Link>
      </Toolbar>
      {companies.map(c =>
        <Company key={c.id}>{c.name}</Company>
      )}
    </Container>
  }
})

export default Companies
