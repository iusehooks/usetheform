const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for FormPersistStateOnUnmount - React ${version}`, () => {
    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogFormPersistStateOnUnmount");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogFormPersistStateOnUnmount").then(console => {
        console.restore();
      });
    });

    before(() => {
      cy.visit(`/index_react_${version}.html?form=FormPersistStateOnUnmount`);
    });

    it("should display the correct initial setup", () => {
      cy.getByDataTestId("form", "FormPersistStateOnUnmount-Form").should(
        "exist"
      );

      cy.get("@consoleLogFormPersistStateOnUnmount").should(
        "be.calledWithExactly",
        "onInit,consoleLogFormPersistStateOnUnmount",
        { user: { name: "abc", lastname: "foo" }, inputs: [["1"]] },
        true
      ); // Deep check

      cy.getByDataTestId("input", "FormPersistStateOnUnmount-input-name")
        .should("be.visible")
        .should("not.be.disabled")
        .should("have.value", `abc`);

      cy.getByDataTestId("input", "FormPersistStateOnUnmount-input-lastname")
        .should("be.visible")
        .should("not.be.disabled")
        .should("have.value", `foo`);
    });

    it("should the state be preserved when inputs wrapped with PersistStateOnUnmount are unmounted", () => {
      cy.getByDataTestId("button", "FormPersistStateOnUnmount-button")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId(
        "input",
        "FormPersistStateOnUnmount-input-name"
      ).should("not.exist");

      cy.getByDataTestId(
        "input",
        "FormPersistStateOnUnmount-input-lastname"
      ).should("not.exist");

      cy.getByDataTestId(
        "input",
        "FormPersistStateOnUnmount-input-array"
      ).should("not.exist");

      cy.getByDataTestId("input", "FormPersistStateOnUnmount-other")
        .should("be.visible")
        .type(`f`);

      cy.get("@consoleLogFormPersistStateOnUnmount").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormPersistStateOnUnmount",
        { user: { name: "abc", lastname: "foo" }, inputs: [["1"]], other: "f" },
        true
      ); // Deep check

      cy.getByDataTestId("button", "FormPersistStateOnUnmount-button")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("input", "FormPersistStateOnUnmount-input-name")
        .should("exist")
        .should("be.visible")
        .type(`d`);

      cy.get("@consoleLogFormPersistStateOnUnmount").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormPersistStateOnUnmount",
        {
          user: { name: "abcd", lastname: "foo" },
          inputs: [["1"]],
          other: "f"
        },
        true
      ); // Deep check

      cy.getByDataTestId("input", "FormPersistStateOnUnmount-input-lastname")
        .should("exist")
        .should("be.visible")
        .type(`d`);

      cy.get("@consoleLogFormPersistStateOnUnmount").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormPersistStateOnUnmount",
        {
          user: { name: "abcd", lastname: "food" },
          inputs: [["1"]],
          other: "f"
        },
        true
      ); // Deep check

      cy.getByDataTestId("input", "FormPersistStateOnUnmount-input-array")
        .should("exist")
        .should("be.visible")
        .type(`1`);

      cy.get("@consoleLogFormPersistStateOnUnmount").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormPersistStateOnUnmount",
        {
          user: { name: "abcd", lastname: "food" },
          inputs: [["11"]],
          other: "f"
        },
        true
      ); // Deep check
    });

    it("should reset the form to its initial state", () => {
      cy.getByDataTestId("button", "FormPersistStateOnUnmount-reset")
        .should("not.be.disabled")
        .click();

      cy.get("@consoleLogFormPersistStateOnUnmount").should(
        "be.calledWithExactly",
        "onReset,consoleLogFormPersistStateOnUnmount",
        { user: { name: "abc", lastname: "foo" }, inputs: [["1"]] },
        true
      ); // Deep check
    });

    it("should submit the form", () => {
      cy.getByDataTestId("button", "FormPersistStateOnUnmount-submit")
        .should("not.be.disabled")
        .click();

      cy.get("@consoleLogFormPersistStateOnUnmount").should(
        "be.calledWithExactly",
        "onSubmit,consoleLogFormPersistStateOnUnmount",
        { user: { name: "abc", lastname: "foo" }, inputs: [["1"]] },
        true
      ); // Deep check
    });
  });
});
