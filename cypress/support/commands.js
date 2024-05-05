// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("getByDataTestId", (attributeType, selector) => {
  return cy.get(`${attributeType}[data-testid=${selector}]`);
});

Cypress.Commands.add("simpleFormWithAsyncSetup", () => {
  cy.getByDataTestId("button", "simpleFormWithAsync-submit").should(
    "be.disabled"
  );
  cy.getByDataTestId("button", "simpleFormWithAsync-reset").should(
    "be.disabled"
  );
  cy.getByDataTestId("input", "email").type("johndoe@gmail.com");
  cy.getByDataTestId("input", "simpleFormWithAsyncInput3")
    .clear()
    .type("Julian Mantle");

  cy.getByDataTestId("button", "simpleFormWithAsync-reset").should(
    "not.be.disabled"
  );
  cy.get("body").click();
  cy.getByDataTestId("button", "simpleFormWithAsync-submit").should(
    "not.be.disabled"
  );

  cy.getByDataTestId("input", "simpleFormWithAsyncInput1")
    .clear()
    .type("John Doe");

  cy.getByDataTestId("input", "simpleFormWithAsyncInput2")
    .clear()
    .type("Alice Bob");
  cy.getByDataTestId("button", "add-input-simpleFormWithAsync").first().click();

  cy.getByDataTestId("button", "add-input-simpleFormWithAsync").first().click();
});
