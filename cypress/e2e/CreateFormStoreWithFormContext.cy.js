const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for CreateFormStoreWithFormContext - React ${version}`, () => {
    before(() => {
      cy.visit(`/index_react_${version}.html?form=CreateFormStoreWithFormContext`);
    });

    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogCreateFormStoreWithFormContext");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogCreateFormStoreWithFormContext").then(console => {
        console.restore();
      });
    });

    it("should Form render with all its initial values", () => {
      cy.getByDataTestId("form", "CreateFormStoreWithFormContext-Form").should("exist");

      cy.get("@consoleLogCreateFormStoreWithFormContext").should(
        "be.calledWithExactly",
        "onInit,consoleLogCreateFormStoreWithFormContext",
        { array: { nested: [1] }, counter: 10, name: "Antonio Test",  lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
        false
      ); // Deep check

      cy.getByDataTestId("input", "CreateFormStoreWithFormContext-counter").should("exist").should("have.value", "10");
      cy.getByDataTestId("span", "CreateFormStoreWithFormContext-Counter-Value").should("exist").should("have.text", "10");
      cy.getByDataTestId("span", "CreateFormStoreWithFormContext-CounterReader-nested").should("have.text", "1");
      cy.getByDataTestId("input", "CreateFormStoreWithFormContext-nested").should("have.value", "1");
      cy.getByDataTestId("input", "CreateFormStoreWithFormContext-name").should("exist").should("have.value", "Antonio Test");
      cy.getByDataTestId("input", "CreateFormStoreWithFormContext-inputNested").should("exist").should("have.value", "hi");
      cy.getByDataTestId("input", "CreateFormStoreWithFormContext-lastname").should("exist").should("have.value", "foo");
      cy.getByDataTestId("button", "CreateFormStoreWithFormContext-submit").should("exist").should("be.disabled");
      cy.getByDataTestId("button", "CreateFormStoreWithFormContext-reset").should("exist").should("be.disabled");
    });

    it("should increment and decrement the Counter", () => {
      let counterValue = 10;
      for (let i = 0; i < 10; i++) {
        counterValue++;
        cy.getByDataTestId("button", "CreateFormStoreWithFormContext-Increase").click();
        cy.get("@consoleLogCreateFormStoreWithFormContext").should(
          "be.calledWithExactly",
          "onChange,consoleLogCreateFormStoreWithFormContext",
          { array: { nested: [1] }, counter: counterValue, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
          false
        ); // Deep check
        cy.getByDataTestId("input", "CreateFormStoreWithFormContext-counter").should("have.value", `${counterValue}`);
        cy.getByDataTestId("span", "CreateFormStoreWithFormContext-Counter-Value").should("have.text", `${counterValue}`);
      }

      for (let i = 0; i < 10; i++) {
        counterValue--;
         cy.getByDataTestId("button", "CreateFormStoreWithFormContext-Decrease").click();
         cy.get("@consoleLogCreateFormStoreWithFormContext").should(
          "be.calledWithExactly",
          "onChange,consoleLogCreateFormStoreWithFormContext",
          { array: { nested: [1] }, counter: counterValue, name: "Antonio Test",  lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
          false
        ); // Deep check
        cy.getByDataTestId("input", "CreateFormStoreWithFormContext-counter").should("have.value", `${counterValue}`);
        cy.getByDataTestId("span", "CreateFormStoreWithFormContext-Counter-Value").should("have.text", `${counterValue}`);
      }
    });

    it("should set the Counter input to a specific value", () => {
      cy.getByDataTestId("button", "CreateFormStoreWithFormContext-Counter-Set").click();
      cy.get("@consoleLogCreateFormStoreWithFormContext").should(
        "be.calledWithExactly",
        "onChange,consoleLogCreateFormStoreWithFormContext",
        { array: { nested: [1] }, counter: 2, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
        false
      ); // Deep check
    });

    it("should set FieldTextNested input to a specific value", () => {
      cy.getByDataTestId("button", "CreateFormStoreWithFormContext-FieldTextNested-Set").click();
      cy.get("@consoleLogCreateFormStoreWithFormContext").should(
        "be.calledWithExactly",
        "onChange,consoleLogCreateFormStoreWithFormContext",
        { array: { nested: [1] }, counter: 2, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hello"]] } },
        false
      ); // Deep check
      cy.getByDataTestId("span", "CreateFormStoreWithFormContext-FieldTextNested").should("have.text", "hello");
    });

    it("should increment and decrement the CounterNested", () => {
      let counterValue = 1;
      for (let i = 0; i < 10; i++) {
        counterValue++;
        cy.getByDataTestId("button", "CreateFormStoreWithFormContext-CounterReader-increment").click();
        cy.get("@consoleLogCreateFormStoreWithFormContext").should(
          "be.calledWithExactly",
          "onChange,consoleLogCreateFormStoreWithFormContext",
          { array: { nested: [counterValue] }, counter: 2, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hello"]] } },
          false
        ); // Deep check
        cy.getByDataTestId("input", "CreateFormStoreWithFormContext-nested").should("have.value", `${counterValue}`);
        cy.getByDataTestId("span", "CreateFormStoreWithFormContext-CounterReader-nested").should("have.text", `${counterValue}`);
      }

      for (let i = 0; i < 10; i++) {
        counterValue--;
        cy.getByDataTestId("button", "CreateFormStoreWithFormContext-CounterReader-decrement").click();
        cy.get("@consoleLogCreateFormStoreWithFormContext").should(
          "be.calledWithExactly",
          "onChange,consoleLogCreateFormStoreWithFormContext",
          { array: { nested: [counterValue] }, counter: 2, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hello"]] } },
          false
        ); // Deep check
        cy.getByDataTestId("input", "CreateFormStoreWithFormContext-nested").should("have.value", `${counterValue}`);
        cy.getByDataTestId("span", "CreateFormStoreWithFormContext-CounterReader-nested").should("have.text", `${counterValue}`);
      }
    });

    it("should reset the Form", () => {
      cy.getByDataTestId("button", "CreateFormStoreWithFormContext-reset").click();
      cy.get("@consoleLogCreateFormStoreWithFormContext").should(
        "be.calledWithExactly",
        "onReset,consoleLogCreateFormStoreWithFormContext",
        { array: { nested: [1] }, counter: 10, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
        false
      ); // Deep check
    });

    it("should show the error label", () => {
      cy.getByDataTestId("input", "CreateFormStoreWithFormContext-email").click();
      cy.get("body").click();
      cy.getByDataTestId("label", "CreateFormStoreWithFormContext-error").should("exist").should("have.text", "Required");
    });

    it("should submit the Form", () => {
      const email = "test@gmail.com";
      cy.getByDataTestId("input", "CreateFormStoreWithFormContext-email").type(email);
      cy.getByDataTestId("button", "CreateFormStoreWithFormContext-submit").click();
      cy.get("@consoleLogCreateFormStoreWithFormContext").should(
        "be.calledWithExactly",
        "onSubmit,consoleLogCreateFormStoreWithFormContext",
        { array: { nested: [1] }, counter: 10, name: "Antonio Test", lastname: "foo", email, inputNested: { inputNested_lv1: [["hi"]] } },
        true
      ); // Deep check
    });
  });
});
