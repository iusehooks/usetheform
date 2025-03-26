// Note : Email is used here for testing is used in SimpleFormWithAsync
describe("Tests for Email", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("test for required email", () => {
    cy.getByDataTestId("input", "email").type("Hello world").clear();
    cy.get("body").click();
    cy.getByDataTestId("label", "email-error")
      .first()
      .should("exist")
      .contains("Required");
  });

  it("test for invalid email", () => {
    cy.getByDataTestId("input", "email")
      .first()
      .type("john doe")
      .should("have.value", "john doe");
    cy.get("body").click();
    cy.getByDataTestId("label", "email-error")
      .first()
      .should("exist")
      .contains("Mail not Valid");
  });

  it("test for valid email", () => {
    cy.getByDataTestId("input", "email")
      .first()
      .type("johndoe@gmail.com")
      .should("have.value", "johndoe@gmail.com");
    cy.get("body").click();
    cy.getByDataTestId("label", "email-error").should("not.exist");
  });
});
