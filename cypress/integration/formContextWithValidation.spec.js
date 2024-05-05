describe("Tests for FormContextWithValidation", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("testing input with email", () => {
    cy.getByDataTestId("input", "test")
      .type("fake@email.com")
      .should("have.value", "fake@email.com");

    cy.getByDataTestId("button", "submit").first().click();

    cy.getByDataTestId("label", "asyncStart")
      .should("be.visible")
      .contains("Checking...");

    cy.getByDataTestId("label", "asyncSuccess").should("be.visible");
  });

  it("testing input to submit without value", () => {
    cy.getByDataTestId("input", "test").should("be.empty");

    cy.getByDataTestId("button", "submit").first().should("be.disabled");
  });

  it("testing input with length less than 5", () => {
    cy.getByDataTestId("input", "test")
      .type("test")
      .should("have.value", "test");

    cy.getByDataTestId("button", "submit").first().click();
    cy.getByDataTestId("label", "asyncStart")
      .should("be.visible")
      .contains("Checking...");

    cy.getByDataTestId("label", "asyncError").should("be.visible");
  });
});
