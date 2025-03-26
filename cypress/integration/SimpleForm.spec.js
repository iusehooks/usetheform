describe("Tests for SimpleForm", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("testing basic setup", () => {
    cy.getByDataTestId("label", "status-error")
      .should("exist")
      .contains("Mail list empty");
    cy.getByDataTestId("button", "simpleForm-submit").should("be.disabled");
    cy.getByDataTestId("button", "simpleForm-reset").should("be.disabled");
  });

  it("testing reset email", () => {
    cy.getByDataTestId("input", "email2").type("John");
    cy.getByDataTestId("button", "simpleForm-reset").should("not.be.disabled");
    cy.getByDataTestId("label", "status-error")
      .should("exist")
      .contains("Some Mails not Valid");
    cy.getByDataTestId("input", "email1").type("Sam");
    cy.getByDataTestId("button", "simpleForm-reset")
      .should("not.be.disabled")
      .click();

    cy.getByDataTestId("input", "email1").should("have.value", "");
    cy.getByDataTestId("input", "email2").should("have.value", "");
    cy.getByDataTestId("button", "simpleForm-submit").should("be.disabled");
    cy.getByDataTestId("button", "simpleForm-reset").should("be.disabled");
  });

  it("test that first email is mandatory for submitting form", () => {
    cy.getByDataTestId("input", "email2").type("johndoe@gmail.com");
    cy.getByDataTestId("button", "simpleForm-submit")
      .should("not.be.disabled")
      .click();
    cy.getByDataTestId("label", "async-test-error")
      .should("exist")
      .contains("Error values not allowed");
  });

  it("test for submitting form with valid emails", () => {
    cy.getByDataTestId("input", "email1").type("johndoe@gmail.com");
    cy.getByDataTestId("input", "email2").type("joesmith@gmail.com");
    cy.getByDataTestId("button", "simpleForm-submit")
      .should("not.be.disabled")
      .click();
  });
});
