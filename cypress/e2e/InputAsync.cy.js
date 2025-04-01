// Note : InputAsync is used here for testing is used in SimpleFormWithAsync
const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for InputAsync - React ${version}`, () => {
    beforeEach(() => {
      cy.visit(`/index_react_${version}.html`);
    });

    it("test for typing and checking input value", () => {
      cy.getByDataTestId("input", "simpleFormWithAsyncInput1")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .clear();
      cy.getByDataTestId("input", "simpleFormWithAsyncInput1").should(
        "have.value",
        ""
      );
      cy.getByDataTestId("input", "simpleFormWithAsyncInput1")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .type("Hello World")
        .should("have.value", "Hello World");
    });

    it("test for checking default input value", () => {
      cy.getByDataTestId("input", "simpleFormWithAsyncInput1").should(
        "have.value",
        "Antonio"
      );

      cy.getByDataTestId(
        "label",
        "asyncSuccess-simpleFormWithAsyncInput1"
      ).should("exist");
    });

    it("test for input with length less than 3", () => {
      cy.getByDataTestId("input", "simpleFormWithAsyncInput1")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .clear()
        .type("An");
      cy.get("body").click();
      cy.getByDataTestId("label", "asyncStart-simpleFormWithAsyncInput1")
        .should("exist")
        .contains("Checking...");
      cy.getByDataTestId("label", "asyncError-simpleFormWithAsyncInput1")
        .should("exist")
        .contains("Error");
    });
  });
});
