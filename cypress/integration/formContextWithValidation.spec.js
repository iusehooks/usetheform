beforeEach(() => {
  cy.visit('http://localhost:3000')
})

describe('Check if FormContextWithValidation works', () => {
  it('testing form with email', () => {
    cy.get('input[name="test"]')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')

    cy.get('button[data-testid="submit"]').first().click()
    cy.get('label[data-testid="asyncSuccess"]')
      .should('be.visible')
  })

  it('testing to submit without value', () => {
    cy.get('input[name="test"]')
      .should('be.empty')

    cy.get('button[data-testid="submit"]').first()
      .should('be.disabled')
  })

})