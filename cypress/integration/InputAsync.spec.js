// Note : InputAsync is used here for testing is used in SimpleFormWithAsync
describe("Tests for InputAsync", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("test for typing and checking input value", () => {
    cy.getByDataTestId("input", "simpleFormWithAsyncInput1").clear();
    cy.getByDataTestId("input", "simpleFormWithAsyncInput1").should(
      "have.value",
      ""
    );
    cy.getByDataTestId("input", "simpleFormWithAsyncInput1")
      .type("Hello World")
      .should("have.value", "Hello World");
  });

  it("test for checking default input value", () => {
    cy.getByDataTestId(
      "label",
      "asyncNotStartedYet-simpleFormWithAsyncInput1"
    ).should("exist");

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
    cy.getByDataTestId("input", "simpleFormWithAsyncInput1").clear().type("An");
    cy.get("body").click();
    cy.getByDataTestId("label", "asyncStart-simpleFormWithAsyncInput1")
      .should("exist")
      .contains("Checking...");
    cy.getByDataTestId("label", "asyncError-simpleFormWithAsyncInput1")
      .should("exist")
      .contains("Error");
  });
});
