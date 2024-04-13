describe("Tests for BigForm", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("test that there are exactly 100 inputs in the form and they have empty value", () => {
    cy.getByDataTestId("form", "bigForm-form")
      .should("exist")
      .within(() => {
        cy.get("input").should("have.length", 100);
      });

    for (let index = 0; index < 100; index++) {
      cy.getByDataTestId("input", `bigForm-input-${index}`)
        .should("exist")
        .should("have.value", "");
    }
  });

  it("testing input with a large value", () => {
    const largeText = "A".repeat(200) + "B".repeat(200) + "C".repeat(200);
    cy.getByDataTestId("input", `bigForm-input-0`).type(largeText);
    cy.getByDataTestId("input", `bigForm-input-0`).should(
      "have.value",
      largeText
    );
  });

  it("testing input with special characters", () => {
    const specialChars = '!@#$%^&*()_+{}|:"<>?';
    cy.getByDataTestId("input", `bigForm-input-10`).type(specialChars);
    cy.getByDataTestId("input", `bigForm-input-10`).should(
      "have.value",
      specialChars
    );
  });
});
