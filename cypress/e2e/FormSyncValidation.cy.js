const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for FormSyncValidation - React ${version}`, () => {
    before(() => {
      cy.visit(`/index_react_${version}.html?form=FormSyncValidation`);
    });

    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogFormSyncValidation");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogFormSyncValidation").then(console => {
        console.restore();
      });
    });

    it("should display errors because form is not valid", () => {
      cy.getByDataTestId("form", "FormSyncValidation-Form").should("exist");
      cy.get("@consoleLogFormSyncValidation").should(
        "be.calledWithExactly",
        "onInit,FormSyncValidation",
        {
          sum: { A: 1, B: 2 },
          innerCollection: { sum: [1, 2] },
          innerCollectionCheckbox: { OptionA: 1, OptionC: 1 },
          innerCollectionCheckboxArray: {
            checkboxes: ["ok", , 1]
          }
        },
        false
      ); // Deep check

      cy.getByDataTestId("button", "FormSyncValidationSeeResults")
        .should("exist")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("label", "statusInputEmailErrorLabel")
        .should("exist")
        .contains("Required");

      cy.getByDataTestId("label", "statusCollectionErrorLabel")
        .should("exist")
        .contains("A+B must be > 10");

      cy.getByDataTestId("label", "statusInnerCollectionErrorLabel")
        .should("exist")
        .contains("Value[0]+Value[1] must be > 10");

      cy.getByDataTestId("label", "statusCheckBoxInnerCollection")
        .should("exist")
        .contains("Checkboxes must be checked!");

      cy.getByDataTestId("label", "statusCheckBoxInnerCollectionArray")
        .should("exist")
        .contains("Checkboxes must be checked!");
    });

    it("should upload a file", () => {
      const fileName = "test-file.pdf"; // This should be in cypress/fixtures
      cy.getByDataTestId("input", "fileUploadFormSyncValidation")
        .should("exist")
        .should("not.be.disabled")
        .attachFile(fileName);

      cy.getByDataTestId("input", "fileUploadFormSyncValidation")
        .should("exist")
        .should("not.be.disabled")
        .invoke("val")
        .should("include", "test-file.pdf");

      cy.get("@consoleLogFormSyncValidation")
        .should("have.been.called") // Check it was called
        .then(spy => {
          const call = spy.getCall(0); // Get first call
          const args = call.args;

          expect(args[0]).to.equal("onChange,FormSyncValidation");
          expect(args[1].fileUpload.name).to.equal(fileName);
        });

      cy.fixture("test-file.pdf", "binary").then(fileBinary => {
        // Convert binary string to a Blob
        const blob = Cypress.Blob.binaryStringToBlob(
          fileBinary,
          "application/pdf"
        );

        const fileUpload = new File([blob], "test-file.pdf", {
          type: "application/pdf"
        });
        cy.get("@consoleLogFormSyncValidation").should(
          "be.calledWithExactly",
          "onChange,FormSyncValidation",
          {
            sum: { A: 1, B: 2 },
            innerCollection: { sum: [1, 2] },
            innerCollectionCheckbox: { OptionA: 1, OptionC: 1 },
            innerCollectionCheckboxArray: {
              checkboxes: ["ok", , 1]
            },
            fileUpload
          },
          false
        ); // Deep check xw
      });
    });

    it("should reset the form", () => {
      cy.getByDataTestId("button", "FormSyncValidation-reset")
        .should("exist")
        .should("not.be.disabled")
        .click();

      cy.get("@consoleLogFormSyncValidation").should(
        "be.calledWithExactly",
        "onReset,FormSyncValidation",
        {
          sum: { A: 1, B: 2 },
          innerCollection: { sum: [1, 2] },
          innerCollectionCheckbox: { OptionA: 1, OptionC: 1 },
          innerCollectionCheckboxArray: {
            checkboxes: ["ok", , 1]
          }
        },
        // eslint-disable-next-line prettier/prettier
        false);
    });

    it("should sumbit a validate form", () => {
      cy.getByDataTestId("input", "emailFormSyncValidation")
        .should("exist")
        .should("not.be.disabled")
        .type("test@gmail.com");

      cy.getByDataTestId("input", "sumInputFormSyncValidation")
        .should("exist")
        .should("not.be.disabled")
        .clear()
        .type(10);

      cy.getByDataTestId("input", "sumInputFormSyncValidationArray")
        .should("exist")
        .should("not.be.disabled")
        .clear()
        .type(10);

      cy.getByDataTestId("input", "checkboxeFormSyncValidation")
        .should("exist")
        .should("not.be.disabled")
        .click();

      cy.getByDataTestId("input", "checkboxeFormSyncValidationArray")
        .should("exist")
        .should("not.be.disabled")
        .click();

      cy.get("@consoleLogFormSyncValidation").should(
        "be.calledWithExactly",
        "onChange,FormSyncValidation",
        {
          email: "test@gmail.com",
          sum: { A: 10, B: 2 },
          innerCollection: { sum: [10, 2] },
          innerCollectionCheckbox: { OptionA: 1, OptionB: 1, OptionC: 1 },
          innerCollectionCheckboxArray: { checkboxes: ["ok", "ok", 1] }
        },
        true
      ); // Deep check

      cy.getByDataTestId("button", "FormSyncValidation-submit")
        .should("exist")
        .should("not.be.disabled")
        .click();

      cy.get("@consoleLogFormSyncValidation").should(
        "be.calledWithExactly",
        "onSubmit,FormSyncValidation",
        {
          email: "test@gmail.com",
          sum: { A: 10, B: 2 },
          innerCollection: { sum: [10, 2] },
          innerCollectionCheckbox: { OptionA: 1, OptionB: 1, OptionC: 1 },
          innerCollectionCheckboxArray: { checkboxes: ["ok", "ok", 1] }
        },
        true
      ); // Deep check
    });
  });
});
