// Note : CollectionAsyncValidation is used in SimpleFormWithAsync
describe("Tests for CollectionAsyncValidation", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("test for adding and removing new input", () => {
    cy.getByDataTestId("button", "add-input-simpleFormWithAsync")
      .first()
      .click();

    cy.getByDataTestId("input", "input-1-simpleFormWithAsync")
      .should("exist")
      .should("have.value", "1")
      .clear()
      .type("Hello World")
      .should("have.value", "Hello World");

    cy.getByDataTestId("button", "remove-input-simpleFormWithAsync")
      .first()
      .click();

    cy.getByDataTestId("input", "input-1-simpleFormWithAsync").should(
      "not.exist"
    );
  });
});
