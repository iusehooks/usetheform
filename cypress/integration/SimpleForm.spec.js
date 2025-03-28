const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for SimpleForm - React ${version}`, () => {
    beforeEach(() => {
      cy.visit(`/index_react_${version}.html`);
    });

    it("testing basic setup", () => {
      cy.getByDataTestId("label", "status-error")
        .should("exist")
        .contains("Mail list empty");
      cy.getByDataTestId("button", "simpleForm-submit").should("be.disabled");
      cy.getByDataTestId("button", "simpleForm-reset").should("be.disabled");
    });

    it("test that form default initial values", () => {
      cy.getByDataTestId("input", "jobTitle")
        .should("not.be.disabled")
        .should("have.value", "none");

      cy.getByDataTestId("input", "line1")
        .should("not.be.disabled")
        .should("have.value", "via 1");

      cy.getByDataTestId("input", "line2")
        .should("not.be.disabled")
        .should("have.value", "via 2");

      cy.getByDataTestId("input", "name")
        .should("not.be.disabled")
        .should("have.value", "Antonio");

      cy.getByDataTestId("input", "surname")
        .should("not.be.disabled")
        .should("have.value", "Pangallo");

      cy.getByDataTestId("input", "gender")
        .should("not.be.disabled")
        .should("have.value", "Male");

      cy.getByDataTestId("input", "age")
        .should("not.be.disabled")
        .should("have.value", "40");
    });

    it("testing reset email", () => {
      cy.getByDataTestId("input", "email2").type("John");
      cy.getByDataTestId("button", "simpleForm-reset").should(
        "not.be.disabled"
      );
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
      cy.getByDataTestId("input", "email2")
        .should("not.be.disabled")
        .clear()
        .type("johndoe@gmail.com");
      cy.getByDataTestId("button", "simpleForm-submit")
        .should("not.be.disabled")
        .click();
      cy.getByDataTestId("label", "async-test-error")
        .should("exist")
        .contains("Error values not allowed");
    });

    it("test for submitting form with valid emails", () => {
      cy.getByDataTestId("input", "email1")
        .should("not.be.disabled")
        .clear()
        .type("johndoe@gmail.com");
      cy.getByDataTestId("input", "email2")
        .should("not.be.disabled")
        .clear()
        .type("joesmith@gmail.com");
      cy.getByDataTestId("button", "simpleForm-submit")
        .should("not.be.disabled")
        .click();
    });
  });
});
