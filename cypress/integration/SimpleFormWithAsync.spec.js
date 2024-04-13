describe("Tests for SimpleFormWithAsync", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("test for resetting form", () => {
    cy.simpleFormWithAsyncSetup();
    cy.getByDataTestId("input", "input-1-simpleFormWithAsync").should(
      "exist"
    );
    cy.getByDataTestId("input", "input-2-simpleFormWithAsync").should(
      "exist"
    );
    cy.getByDataTestId("button", "simpleFormWithAsync-reset").first().click();
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

    cy.getByDataTestId("button", "remove-input-simpleFormWithAsync").click();

    cy.getByDataTestId("button", "simpleFormWithAsync-submit").click();

    cy.getByDataTestId("label", "asyncError")
      .should("exist")
      .contains("Add at least two Inputs");

    cy.getByDataTestId("input", "simpleFormWithAsyncInput3")
      .clear()
      .type("333");

    cy.get("body").click();
    cy.getByDataTestId("button", "simpleFormWithAsync-submit").should(
      "be.disabled"
    );
    cy.getByDataTestId("input", "simpleFormWithAsyncInput3")
      .clear()
      .type("Michael Davis");
    cy.getByDataTestId("button", "simpleFormWithAsync-submit").should(
      "not.be.disabled"
    );
    cy.getByDataTestId("button", "add-input-simpleFormWithAsync").first().click();
    cy.getByDataTestId("button", "simpleFormWithAsync-submit").click();
  });
});
