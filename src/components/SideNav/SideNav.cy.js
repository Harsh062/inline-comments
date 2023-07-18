import React from 'react'
import SideNav from './SideNav'

describe('<SideNav />', () => {
  before(function () {
    cy.fixture('drafts.json').as('drafts')
  })
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.get('@drafts').then(drafts => {
      cy.invoke('prop', 'drafts', drafts).mount(<SideNav drafts={drafts}/>)
    });
  })
})