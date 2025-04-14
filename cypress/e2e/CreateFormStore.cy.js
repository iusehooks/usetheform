const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for CreateFormStore - React ${version}`, () => {
    before(() => {
      cy.visit(`/index_react_${version}.html?form=CreateFormStore`);
    });

    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogCreateFormStore");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogCreateFormStore").then(console => {
        console.restore();
      });
    });

    it("should form render with all its initial values", () => {
      cy.getByDataTestId("form", "CreateFormStore-Form").should("exist");

      cy.get("@consoleLogCreateFormStore").should(
        "be.calledWithExactly",
        "onInit,consoleLogCreateFormStore",
        { array: { nested: [1] }, counter: 10, name: "Antonio Test",  lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
        false
      ); // Deep check

      cy.getByDataTestId("input", "CreateFormStore-counter").should("exist").should("have.value", "10");
      cy.getByDataTestId("span", "CreateFormStore-Counter-Value").should("exist").should("have.text", "10");
      cy.getByDataTestId("input", "CreateFormStore-nested").should("have.value", "1");
      cy.getByDataTestId("input", "CreateFormStore-name").should("exist").should("have.value", "Antonio Test");
      cy.getByDataTestId("input", "CreateFormStore-inputNested").should("exist").should("have.value", "hi");
      cy.getByDataTestId("input", "CreateFormStore-collection-nested").should("exist").should("have.value", "");
      cy.getByDataTestId("input", "CreateFormStore-lastname").should("exist").should("have.value", "foo");
      cy.getByDataTestId("button", "CreateFormStore-submit").should("exist").should("be.disabled");
      cy.getByDataTestId("button", "CreateFormStore-reset").should("exist").should("be.disabled");
    });

    it("should increment and decrement the counter", () => {
      let counterValue = 10;
      for (let i = 0; i < 10; i++) {
        counterValue++;
        cy.getByDataTestId("button", "CreateFormStore-Increase").click();
        cy.get("@consoleLogCreateFormStore").should(
          "be.calledWithExactly",
          "onChange,consoleLogCreateFormStore",
          { array: { nested: [1] }, counter: counterValue, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
          false
        ); // Deep check
        cy.getByDataTestId("input", "CreateFormStore-counter").should("have.value", `${counterValue}`);
        cy.getByDataTestId("span", "CreateFormStore-Counter-Value").should("have.text", `${counterValue}`);
      }

      for (let i = 0; i < 10; i++) {
        counterValue--;
         cy.getByDataTestId("button", "CreateFormStore-Decrease").click();
         cy.get("@consoleLogCreateFormStore").should(
          "be.calledWithExactly",
          "onChange,consoleLogCreateFormStore",
          { array: { nested: [1] }, counter: counterValue, name: "Antonio Test",  lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
          false
        ); // Deep check
        cy.getByDataTestId("input", "CreateFormStore-counter").should("have.value", `${counterValue}`);
        cy.getByDataTestId("span", "CreateFormStore-Counter-Value").should("have.text", `${counterValue}`);
      }
    });

    it("should set the Counter input to a specific value", () => {
      cy.getByDataTestId("button", "CreateFormStore-Counter-Set").click();
      cy.get("@consoleLogCreateFormStore").should(
        "be.calledWithExactly",
        "onChange,consoleLogCreateFormStore",
        { array: { nested: [1] }, counter: 2, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
        false
      ); // Deep check
    });

    it("should set FieldTextNested input to a specific value", () => {
      cy.getByDataTestId("button", "CreateFormStore-FieldTextNested-Set").click();
      cy.get("@consoleLogCreateFormStore").should(
        "be.calledWithExactly",
        "onChange,consoleLogCreateFormStore",
        { array: { nested: [1] }, counter: 2, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hello"]] } },
        false
      ); // Deep check
      cy.getByDataTestId("span", "CreateFormStore-FieldTextNested").should("have.text", "hello");
    });


    it("should set CollectionNested to a specific value", () => {
      const collectionValue = { nested: { "collection-nested": "hello" } }
      cy.getByDataTestId("button", "CreateFormStore-CollectionNested-Set").click();
      cy.get("@consoleLogCreateFormStore").should(
        "be.calledWithExactly",
        "onChange,consoleLogCreateFormStore",
        { collection: collectionValue, array: { nested: [1] }, counter: 2, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hello"]] } },
        false
      ); // Deep check
      cy.getByDataTestId("input", "CreateFormStore-collection-nested").should("exist").should("have.value", "hello");
      cy.getByDataTestId("span", "CreateFormStore-CollectionNested-Value").should("exist").should("have.text", JSON.stringify(collectionValue));
    });


    it("should reset the form", () => {
      cy.getByDataTestId("button", "CreateFormStore-reset").click();
      cy.get("@consoleLogCreateFormStore").should(
        "be.calledWithExactly",
        "onReset,consoleLogCreateFormStore",
        { array: { nested: [1] }, counter: 10, name: "Antonio Test", lastname: "foo", inputNested: { inputNested_lv1: [["hi"]] } },
        false
      ); // Deep check
    });

    it("should show the error label", () => {
      cy.getByDataTestId("input", "CreateFormStore-email").click();
      cy.get("body").click();
      cy.getByDataTestId("label", "CreateFormStore-error").should("exist").should("have.text", "Required");
    });

    it("should submit the form", () => {
      const email = "test@gmail.com";
      cy.getByDataTestId("input", "CreateFormStore-email").type(email);
      cy.getByDataTestId("button", "CreateFormStore-submit").click();
      cy.get("@consoleLogCreateFormStore").should(
        "be.calledWithExactly",
        "onSubmit,consoleLogCreateFormStore",
        { array: { nested: [1] }, counter: 10, name: "Antonio Test", lastname: "foo", email, inputNested: { inputNested_lv1: [["hi"]] } },
        true
      ); // Deep check
    });
  });
});
