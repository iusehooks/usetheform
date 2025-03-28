const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for BigForm - React ${version}`, () => {
    beforeEach(() => {
      // Adjust the path if your app uses the version in the URL or query param
      cy.visit(`/index_react_${version}.html`);
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
      cy.getByDataTestId("input", `bigForm-input-0`)
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .type(largeText);
      cy.getByDataTestId("input", `bigForm-input-0`).should(
        "have.value",
        largeText
      );
    });

    it("testing input with special characters", () => {
      const specialChars = '!@#$%^&*()_+{}|:"<>?';
      cy.getByDataTestId("input", `bigForm-input-10`)
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .type(specialChars);
      cy.getByDataTestId("input", `bigForm-input-10`).should(
        "have.value",
        specialChars
      );
    });
  });
});
