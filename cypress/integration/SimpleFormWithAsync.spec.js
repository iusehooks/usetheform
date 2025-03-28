const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for SimpleFormWithAsync - React ${version}`, () => {
    beforeEach(() => {
      cy.visit(`/index_react_${version}.html`);
    });

    it("test for resetting form", () => {
      cy.simpleFormWithAsyncSetup();
      cy.getByDataTestId("input", "input-1-simpleFormWithAsync").should(
        "exist"
      );
      cy.getByDataTestId("input", "input-2-simpleFormWithAsync").should(
        "exist"
      );
      cy.getByDataTestId("button", "simpleFormWithAsync-reset")
        .first()
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();
      cy.getByDataTestId("input", "input-1-simpleFormWithAsync").should(
        "not.exist"
      );
      cy.getByDataTestId("input", "input-2-simpleFormWithAsync").should(
        "not.exist"
      );

      cy.getByDataTestId("input", "email").first().should("have.value", "");
      cy.getByDataTestId("input", "simpleFormWithAsyncInput1").should(
        "have.value",
        "Antonio"
      );
      cy.getByDataTestId("input", "simpleFormWithAsyncInput2").should(
        "have.value",
        "Milan"
      );

      cy.getByDataTestId("input", "simpleFormWithAsyncInput3").should(
        "have.value",
        "333"
      );
    });

    it("test for submitting form", () => {
      cy.simpleFormWithAsyncSetup();

      cy.getByDataTestId("button", "remove-input-simpleFormWithAsync")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("button", "simpleFormWithAsync-submit")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("label", "asyncError")
        .should("exist")
        .contains("Add at least two Inputs");

      cy.getByDataTestId("input", "simpleFormWithAsyncInput3")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .clear()
        .type("333");

      cy.get("body").click();
      cy.getByDataTestId("button", "simpleFormWithAsync-submit").should(
        "be.disabled"
      );
      cy.getByDataTestId("input", "simpleFormWithAsyncInput3")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .clear()
        .type("Michael Davis");

      cy.getByDataTestId("button", "simpleFormWithAsync-submit", {
        timeout: 10000
      })
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled");

      cy.getByDataTestId("button", "add-input-simpleFormWithAsync")
        .first()
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();
      cy.getByDataTestId("button", "simpleFormWithAsync-submit")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();
    });
  });
});
