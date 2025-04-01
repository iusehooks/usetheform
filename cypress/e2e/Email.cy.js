// Note : Email is used here for testing is used in SimpleFormWithAsync
const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for Email - React ${version}`, () => {
    beforeEach(() => {
      cy.visit(`/index_react_${version}.html`);
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
});
