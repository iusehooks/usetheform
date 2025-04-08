const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for FormContextWithValidation - React ${version}`, () => {
    beforeEach(() => {
      cy.visit(`/index_react_${version}.html?form=FormContextWithValidation`);
    });

    it("should test input with email", () => {
      cy.getByDataTestId("form", "FormContextWithValidation-Form").should(
        "exist"
      );
      cy.getByDataTestId("input", "test")
        .type("fake@email.com")
        .should("have.value", "fake@email.com");

      cy.getByDataTestId("button", "submit").first().click();

      cy.getByDataTestId("label", "FormContextWithValidation-asyncStart")
        .should("be.visible")
        .contains("Checking...");

      cy.getByDataTestId(
        "label",
        "FormContextWithValidation-asyncSuccess"
      ).should("be.visible");
    });

    it("should test input submission without value", () => {
      cy.getByDataTestId("form", "FormContextWithValidation-Form").should(
        "exist"
      );
      cy.getByDataTestId("input", "test").should("be.empty");

      cy.getByDataTestId("button", "submit").first().should("be.disabled");
    });

    it("should test input with length less than 5", () => {
      cy.getByDataTestId("form", "FormContextWithValidation-Form").should(
        "exist"
      );
      cy.getByDataTestId("input", "test")
        .type("test")
        .should("have.value", "test");

      cy.getByDataTestId("button", "submit").first().click();
      cy.getByDataTestId("label", "FormContextWithValidation-asyncStart")
        .should("be.visible")
        .contains("Checking...");

      cy.getByDataTestId(
        "label",
        "FormContextWithValidation-asyncError"
      ).should("be.visible");
    });
  });
});
