beforeEach(() => {
  cy.visit('http://localhost:3000')
})

describe('Test if demo app running', () => {
  it('Visits localhost website', () => {
    cy.visit('http://localhost:3000')
  })
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

describe('Check if FormWithAsync works', () => {
  it('Testing input creation and deletion', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('button')
        .contains('Add an Input')
        .should('be.enabled')
        .click()
        .click()

      cy.get('input[value="1"]')
        .should('have.value', '1')

      cy.get('input[value="2"]')
        .should('exist')

      cy.get('button')
        .contains('Remove an Input')
        .should('be.enabled')
        .click()

      cy.get('input[value="2"]')
        .should('not.exist') 
    })
  })

  it('testing input mail required', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('input[data-testid="email"]').click()
      cy.get('div').first().click()
      cy.get('label').contains('Required')
    })
  })

  it('testing input with valid email', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('input[data-testid="email"]')
        .type('fake@email.com')
        .should('have.value', 'fake@email.com')
      
      cy.get('div').first().click()
    })
  })

  it('testing input with bad email', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('input[data-testid="email"]')
        .type('string')
        .should('have.value', 'string')
      
      cy.get('div').first().click()
      cy.get('label').contains('Mail not Valid')
    })
  })

  it('testing default empty Async Input', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('label[data-testid="asyncNotStartedYet"]')
    })
  })

  it('testing filled Async Input', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('input[data-testid="asyncinput"]')
        .first()
        .type('string')
        .should('have.value', 'string')
      
      cy.get('div').first().click()
      cy.get('label[data-testid="asyncSuccess"]').contains('Success')
    })
  })

  it('testing Async Input error', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('input[data-testid="asyncinput"]')
        .first()
        .click()
        .should('not.have.value')
      
      cy.get('div').first().click()
      cy.get('label[data-testid="asyncError"]').contains('Error')
    })
  })

  it('testing form submit without enough input', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('input[data-testid="email"]')
        .type('fake@email.com')
        .should('have.value', 'fake@email.com')
      cy.get('input[name="username"]')
        .type('username')
      cy.get('input[name="city"]')
        .type('city')
      cy.get('input[data-testid="asyncinput"]')
        .last()
        .type('value')
      cy.get('div').first().click()
      cy.get('button[data-testid="submit"]')
        .click()
      cy.get('label[data-testid="asyncError"]')
        .contains('Add at least two Inputs')
    })
  })

  it('testing form submit with valid fields', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('button')
        .contains('Add an Input')
        .click()
        .click()
      cy.get('input[data-testid="email"]')
        .type('fake@email.com')
        .should('have.value', 'fake@email.com')
      cy.get('input[name="username"]')
        .type('username')
      cy.get('input[name="city"]')
        .type('city')
      cy.get('input[data-testid="asyncinput"]')
        .last()
        .type('value')
      cy.get('div').first().click()
      cy.get('button[data-testid="submit"]')
        .click()
    })
  })
  
  it('testing form reset button', () => {
    cy.get('form[data-testid="formWithAsync"]').within(($form) => {
      cy.get('button')
        .contains('Add an Input')
        .click()
        .click()
      cy.get('input[data-testid="email"]')
        .type('fake@email.com')
        .should('have.value', 'fake@email.com')
      cy.get('input[name="username"]')
        .type('username')
      cy.get('input[name="city"]')
        .type('city')
      cy.get('input[data-testid="asyncinput"]')
        .last()
        .type('value')
      cy.get('div').first().click()
      cy.get('button[data-testid="reset"]')
        .click()

      cy.get('input[data-testid="email"]').should('not.have.value') 
      cy.get('input[name="username"]').should('not.have.value') 
      cy.get('input[name="city"]').should('not.have.value') 
      cy.get('input[data-testid="asyncinput"]').last().should('not.have.value') 
    })
  })
})