const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for BigFormCollectionArray - React ${version}`, () => {
    before(() => {
      cy.visit(`/index_react_${version}.html?form=BigFormCollectionArray`);
    });

    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogBigFormCollectionArray");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogBigFormCollectionArray").then(console => {
        console.restore();
      });
    });

    it("should BigFormCollectionArray Form contains 100 text input fields", () => {
      cy.getByDataTestId("form", "BigFormCollectionArray-Form").should("exist");
      cy.get("@consoleLogBigFormCollectionArray").should(
        "be.calledWithExactly",
        "onInit,consoleLogBigFormCollectionArray",
        { array: new Array(100).fill(1).map((_, i) => `${i}`) },
        true
      ); // Deep check

      new Array(100).fill(1).forEach((_, i) => {
        cy.getByDataTestId("input", `BigFormCollectionArray-input-${i}`)
          .should("exist")
          .and("have.value", `${i}`);
      });
    });
  });
});
