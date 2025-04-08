const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for WizardForm - React ${version}`, () => {
    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogWizardForm");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogWizardForm").then(consoleLogWizardForm => {
        consoleLogWizardForm.restore();
      });
    });

    before(() => {
      cy.visit(`/index_react_${version}.html?form=WizardForm`);
    });

    it("should display the correct initial setup", () => {
      cy.getByDataTestId("form", "WizardForm-form1").should("exist");
      cy.getByDataTestId("form", "WizardForm-form2").should("exist");
      cy.getByDataTestId("button", "WizardForm-getState")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("code", "WizardForm-code").should(
        "have.text",
        `{"name":"foo","lastname":"mouse"}`
      );
    });

    it("should update the wizard state", () => {
      cy.getByDataTestId("input", "WizardForm-form1-name").type("1");
      cy.get("@consoleLogWizardForm").should(
        "be.calledWithExactly",
        "onChange,consoleLogWizardForm",
        { name: "foo1", lastname: "mouse" }
      ); // Deep check

      cy.getByDataTestId("input", "WizardForm-form2-lastname").type("2");
      cy.get("@consoleLogWizardForm").should(
        "be.calledWithExactly",
        "onChange,consoleLogWizardForm",
        { name: "foo1", lastname: "mouse2" }
      ); // Deep check

      cy.getByDataTestId("button", "WizardForm-getState")
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("code", "WizardForm-code").should(
        "have.text",
        `{"name":"foo1","lastname":"mouse2"}`
      );
    });
  });
});
