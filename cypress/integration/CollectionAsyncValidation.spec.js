// Note : CollectionAsyncValidation is used in SimpleFormWithAsync
const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for CollectionAsyncValidation - React ${version}`, () => {
    beforeEach(() => {
      cy.visit(`/index_react_${version}.html`);
    });

    it("test for adding and removing new input", () => {
      cy.getByDataTestId("button", "add-input-simpleFormWithAsync")
        .first()
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("input", "input-1-simpleFormWithAsync")
        .should("exist")
        .should("be.visible")
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
});
