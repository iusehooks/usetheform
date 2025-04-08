const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for FormWithCustomInputAndSelector - React ${version}`, () => {
    before(() => {
      cy.visit(
        `/index_react_${version}.html?form=FormWithCustomInputAndSelector`
      );
    });

    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogFormWithCustomInputAndSelector");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogFormWithCustomInputAndSelector").then(console => {
        console.restore();
      });
    });

    it("should FormWithCustomInputAndSelector Form contain all its inputs", () => {
      cy.getByDataTestId("form", "FormWithCustomInputAndSelector-Form").should(
        "exist"
      );

      cy.getByDataTestId(
        "input",
        `FormWithCustomInputAndSelector-counter-input`
      )
        .should("exist")
        .and("have.value", `0`);

      cy.getByDataTestId(
        "span",
        `FormWithCustomInputAndSelector-counter-viewer`
      )
        .should("exist")
        .and("have.text", `0`);

      cy.getByDataTestId("span", `FormWithCustomInputAndSelector-array-viewer`)
        .should("exist")
        .and("have.text", `test`);

      cy.getByDataTestId(
        "p",
        "FormWithCustomInputAndSelector-customfield-error"
      )
        .should("exist")
        .should("be.visible")
        .should("have.text", "Value must be > 5");
    });

    it("should update value from the counter viewer", () => {
      cy.getByDataTestId(
        "input",
        `FormWithCustomInputAndSelector-counter-input`
      ).type("7", { force: true });

      cy.getByDataTestId(
        "button",
        "FormWithCustomInputAndSelector-counter-reset"
      )
        .should("exist")
        .click();

      cy.getByDataTestId(
        "input",
        `FormWithCustomInputAndSelector-counter-input`
      )
        .should("exist")
        .and("have.value", `0`);

      cy.getByDataTestId(
        "span",
        `FormWithCustomInputAndSelector-counter-viewer`
      )
        .should("exist")
        .and("have.text", `0`);
    });

    it("should update custom field value", () => {
      cy.getByDataTestId("button", "FormWithCustomInputAndSelector-customfield")
        .should("exist")
        .click();

      cy.get("@consoleLogFormWithCustomInputAndSelector").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormWithCustomInputAndSelector",
        {
          ...JSON.parse(JSON.stringify(helperObject)),
          customField: { a: 4 },
          inputs: { counter: 0 }
        },
        false
      ); // Deep check
    });

    it("should update custom nested field value", () => {
      cy.getByDataTestId("input", "FormWithCustomInputAndSelector-nested-input")
        .should("exist")
        .type("+++", { force: true });

      cy.get("@consoleLogFormWithCustomInputAndSelector").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormWithCustomInputAndSelector",
        {
          ...JSON.parse(JSON.stringify(helperObject)),
          customField: { a: 4 },
          inputs: { counter: 0 },
          array: [[[["test+++"]]]]
        },
        false
      ); // Deep check

      cy.getByDataTestId("span", `FormWithCustomInputAndSelector-array-viewer`)
        .should("exist")
        .and("have.text", `test+++`);

      cy.getByDataTestId(
        "button",
        "FormWithCustomInputAndSelector-nested-reset"
      )
        .should("exist")
        .click();

      cy.get("@consoleLogFormWithCustomInputAndSelector").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormWithCustomInputAndSelector",
        {
          ...JSON.parse(JSON.stringify(helperObject)),
          customField: { a: 4 },
          inputs: { counter: 0 }
        },
        false
      ); // Deep check
    });

    it("should reset the form to its initial state", () => {
      cy.getByDataTestId("input", "FormWithCustomInputAndSelector-nested-input")
        .should("exist")
        .type("+++", { force: true });

      cy.getByDataTestId(
        "input",
        `FormWithCustomInputAndSelector-counter-input`
      ).type("5", { force: true });

      cy.get("@consoleLogFormWithCustomInputAndSelector").should(
        "be.calledWithExactly",
        "onChange,consoleLogFormWithCustomInputAndSelector",
        {
          ...JSON.parse(JSON.stringify(helperObject)),
          customField: { a: 4 },
          inputs: { counter: "05" },
          array: [[[["test+++"]]]]
        },
        false
      ); // Deep check

      cy.getByDataTestId("span", `FormWithCustomInputAndSelector-array-viewer`)
        .should("exist")
        .and("have.text", `test+++`);

      cy.getByDataTestId(
        "input",
        `FormWithCustomInputAndSelector-counter-input`
      )
        .should("exist")
        .and("have.value", `05`);

      cy.getByDataTestId(
        "span",
        `FormWithCustomInputAndSelector-counter-viewer`
      )
        .should("exist")
        .and("have.text", `05`);

      cy.getByDataTestId("button", `FormWithCustomInputAndSelector-reset`)
        .should("exist")
        .should("not.be.disabled")
        .click();

      cy.get("@consoleLogFormWithCustomInputAndSelector").should(
        "be.calledWithExactly",
        "onReset,consoleLogFormWithCustomInputAndSelector",
        {
          ...JSON.parse(JSON.stringify(helperObject))
        },
        false
      ); // Deep check

      cy.getByDataTestId("span", `FormWithCustomInputAndSelector-array-viewer`)
        .should("exist")
        .and("have.text", `test`);

      cy.getByDataTestId("button", `FormWithCustomInputAndSelector-reset`)
        .should("exist")
        .should("be.disabled");
    });

    it("should submit the form", () => {
      cy.getByDataTestId("button", `FormWithCustomInputAndSelector-submit`)
        .should("exist")
        .should("be.disabled");

      cy.getByDataTestId("button", "FormWithCustomInputAndSelector-customfield")
        .should("exist")
        .click();

      cy.getByDataTestId("button", "FormWithCustomInputAndSelector-customfield")
        .should("exist")
        .click();

      cy.getByDataTestId(
        "button",
        `FormWithCustomInputAndSelector-submit`
      ).click();

      cy.get("@consoleLogFormWithCustomInputAndSelector").should(
        "be.calledWithExactly",
        "onSubmit,consoleLogFormWithCustomInputAndSelector",
        {
          ...JSON.parse(JSON.stringify(helperObject)),
          customField: { a: 6 }
        },
        true
      ); // Deep check
    });
  });
});

const helperObject = {
  array: [[[["test"]]]],
  inputs: { counter: "0" },
  customField: { a: 2 }
};
