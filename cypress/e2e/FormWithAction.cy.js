const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

const fileName = "test-file.pdf"; // This should be in cypress/fixtures
const defaultInitialState = {
  userInfo: {
    age: 18
  }
};

reactVersions.forEach(version => {
  describe(`Tests for FormWithAction - React ${version}`, () => {
    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogFormWithAction");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogFormWithAction").then(consoleLogFormWithAction => {
        consoleLogFormWithAction.restore();
      });
    });

    before(() => {
      cy.visit(`/index_react_${version}.html?form=FormWithAction`);
    });

    it("should display initial form setup with default values and correct attributes", () => {
      cy.getByDataTestId("form", "FormWithAction-Form")
        .should("exist")
        .should("have.attr", "method", "post")
        .should("have.attr", "action", "/FormWithActionSubmit")
        .should("have.attr", "enctype", "multipart/form-data");

      cy.get("@consoleLogFormWithAction").should(
        "be.calledWithExactly",
        "onInit,consoleLogFormWithAction",
        defaultInitialState,
        false
      ); // Deep check

      cy.getByDataTestId("label", "FormWithAction-status-error")
        .should("exist")
        .contains("Missing Mandatory Fields!");

      cy.getByDataTestId("button", "FormWithAction-submit").should(
        "be.disabled"
      );
      cy.getByDataTestId("button", "FormWithAction-reset").should(
        "be.disabled"
      );

      cy.getByDataTestId("label", "FormWithAction-formStatus")
        .should("exist")
        .should("have.text", "ON_INIT");

      cy.getByDataTestId("label", "FormWithAction-submitAttempts")
        .should("exist")
        .should("have.text", "0");

      cy.getByDataTestId("label", "FormWithAction-submitted")
        .should("exist")
        .should("have.text", "0");

      cy.getByDataTestId("label", "FormWithAction-pristine")
        .should("exist")
        .should("have.text", "true");

      cy.getByDataTestId("label", "FormWithAction-isValid")
        .should("exist")
        .should("have.text", "false");

      cy.getByDataTestId("label", "FormWithAction-state")
        .should("exist")
        .should(
          "have.text",
          JSON.stringify({ userInfo: { age: 18 } }) // file is empty because it is File type
        );
    });

    it("should allow a user to upload a file and display the filename", () => {
      cy.getByDataTestId("input", "FormWithAction-file")
        .should("exist")
        .should("not.be.disabled")
        .attachFile(fileName)
        .invoke("val")
        .should("include", "test-file.pdf");
    });

    it("should allow selecting the male gender radio button and mark it as checked", () => {
      cy.getByDataTestId("input", "FormWithAction-gender-m")
        .should("exist")
        .should("not.be.disabled")
        .check()
        .should("be.checked");
    });

    it("should show error message and prevent submission for an invalid form", () => {
      cy.getByDataTestId("button", "FormWithAction-submit")
        .should("exist")
        .should("not.be.disabled")
        .click()
        .should("be.disabled");

      cy.getByDataTestId("label", "FormWithAction-async-status-error")
        .should("exist")
        .contains("Missing Agreement or File!");

      cy.getByDataTestId("label", "FormWithAction-submitAttempts")
        .should("exist")
        .should("have.text", "1");

      cy.getByDataTestId("label", "FormWithAction-submitted")
        .should("exist")
        .should("have.text", "0");

      cy.getByDataTestId("label", "FormWithAction-pristine")
        .should("exist")
        .should("have.text", "false");

      cy.getByDataTestId("label", "FormWithAction-isValid")
        .should("exist")
        .should("have.text", "true");

      cy.getByDataTestId("label", "FormWithAction-formStatus")
        .should("exist")
        .should("have.text", "ON_CHANGE");

      cy.getByDataTestId("label", "FormWithAction-state")
        .should("exist")
        .should(
          "have.text",
          JSON.stringify({ userInfo: { age: 18, gender: "M" }, file: {} }) // file is empty because it is File type
        );
    });

    it("should reset the form to its initial state when the reset button is clicked", () => {
      cy.getByDataTestId("button", "FormWithAction-reset-useform")
        .should("exist")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("label", "FormWithAction-status-error")
        .should("exist")
        .contains("Missing Mandatory Fields!");

      cy.getByDataTestId("label", "FormWithAction-submitAttempts")
        .should("exist")
        .should("have.text", "0");

      cy.getByDataTestId("label", "FormWithAction-submitted")
        .should("exist")
        .should("have.text", "0");

      cy.getByDataTestId("label", "FormWithAction-pristine")
        .should("exist")
        .should("have.text", "true");

      cy.getByDataTestId("label", "FormWithAction-isValid")
        .should("exist")
        .should("have.text", "false");

      cy.getByDataTestId("label", "FormWithAction-formStatus")
        .should("exist")
        .should("have.text", "RESETTED");

      cy.getByDataTestId("label", "FormWithAction-state")
        .should("exist")
        .should(
          "have.text",
          JSON.stringify({ userInfo: { age: 18 } }) // file is empty because it is File type
        );
    });

    it("should successfully submit the form when valid inputs are provided", () => {
      cy.getByDataTestId("input", "FormWithAction-agreement")
        .should("exist")
        .should("not.be.disabled")
        .check()
        .should("be.checked");

      cy.getByDataTestId("input", "FormWithAction-gender-m")
        .should("exist")
        .should("not.be.disabled")
        .check()
        .should("be.checked");

      cy.getByDataTestId("input", "FormWithAction-file")
        .should("exist")
        .should("not.be.disabled")
        .attachFile(fileName)
        .invoke("val")
        .should("include", "test-file.pdf");

      cy.getByDataTestId("button", "FormWithAction-submit")
        .should("exist")
        .should("not.be.disabled")
        .click()
        .should("be.disabled");

      cy.url().should("include", "/FormWithActionSubmit");
    });
  });
});
