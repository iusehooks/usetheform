const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for BigFormCollectionArrayDeepNested - React ${version}`, () => {
    before(() => {
      cy.visit(
        `/index_react_${version}.html?form=BigFormCollectionArrayDeepNested`
      );
    });

    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogBigFormCollectionArrayDeepNested");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogBigFormCollectionArrayDeepNested").then(console => {
        console.restore();
      });
    });

    it("should BigFormCollectionArrayDeepNested Form contains 10 text input fields", () => {
      const expected = [
        "0",
        ["1", ["2", ["3", ["4", ["5", ["6", ["7", ["800", ["9"]]]]]]]]]
      ];
      cy.getByDataTestId(
        "form",
        "BigFormCollectionArrayDeepNested-Form"
      ).should("exist");
      cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
        "be.calledWithExactly",
        "onInit,consoleLogBigFormCollectionArrayDeepNested",
        {
          object: { object_1: { object_2: { object_input: "object_input" } } },
          inputs: [[...expected]]
        },
        true
      ); // Deep check

      for (let i = 0; i < 10; i++) {
        if (i === 8) {
          cy.getByDataTestId(
            "input",
            `BigFormCollectionArrayDeepNested-input-${i}`
          )
            .should("exist")
            .and("have.value", `${800}`);
        } else {
          cy.getByDataTestId(
            "input",
            `BigFormCollectionArrayDeepNested-input-${i}`
          )
            .should("exist")
            .and("have.value", `${i}`);
        }
      }
    });

    it("should clear the value of all input fields", () => {
      const current = [
        "0",
        ["1", ["2", ["3", ["4", ["5", ["6", ["7", ["800", ["9"]]]]]]]]]
      ];
      let index = current;
      cy.getByDataTestId(
        "input",
        `BigFormCollectionArrayDeepNested-input-object_input`
      ).clear();

      for (let i = 0; i < 10; i++) {
        cy.getByDataTestId(
          "input",
          `BigFormCollectionArrayDeepNested-input-${i}`
        ).clear();

        if (i < 9) {
          index[0] = null;
          index = index[1];
        } else if (i === 9) {
          index = null;
        }
        if (index !== null) {
          cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
            "be.calledWithExactly",
            "onChange,consoleLogBigFormCollectionArrayDeepNested",
            {
              inputs: [JSON.parse(JSON.stringify(current))]
            },
            true
          ); // Deep check
        } else {
          cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
            "be.calledWithExactly",
            "onChange,consoleLogBigFormCollectionArrayDeepNested",
            {},
            true
          ); // Deep check
        }
      }
    });

    it("should fill the value of all input fields", () => {
      const current = [];
      let index = current;

      for (let i = 0; i < 10; i++) {
        cy.getByDataTestId(
          "input",
          `BigFormCollectionArrayDeepNested-input-${i}`
        ).type(`${i}`);

        let val = i === 8 ? [`${800}`] : [`${i}`];
        index.push(val);
        index = val;

        cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
          "be.calledWithExactly",
          "onChange,consoleLogBigFormCollectionArrayDeepNested",
          {
            inputs: JSON.parse(JSON.stringify(current))
          },
          true
        ); // Deep check
      }
    });

    it("should fill the value of all input fields randomly", () => {
      cy.getByDataTestId(
        "input",
        `BigFormCollectionArrayDeepNested-input-${4}`
      ).type("6", { force: true }); // Appends to the current value

      cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
        "be.calledWithExactly",
        "onChange,consoleLogBigFormCollectionArrayDeepNested",
        {
          inputs: [
            [
              "0",
              ["1", ["2", ["3", ["46", ["5", ["6", ["7", ["800", ["9"]]]]]]]]]
            ]
          ]
        },
        true
      ); // Deep check

      cy.getByDataTestId(
        "input",
        `BigFormCollectionArrayDeepNested-input-${6}`
      ).type("9", { force: true }); // Appends to the current value

      cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
        "be.calledWithExactly",
        "onChange,consoleLogBigFormCollectionArrayDeepNested",
        {
          inputs: [
            [
              "0",
              ["1", ["2", ["3", ["46", ["5", ["69", ["7", ["800", ["9"]]]]]]]]]
            ]
          ]
        },
        true
      ); // Deep check

      cy.getByDataTestId(
        "input",
        `BigFormCollectionArrayDeepNested-input-${7}`
      ).type("7", { force: true }); // Appends to the current value

      cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
        "be.calledWithExactly",
        "onChange,consoleLogBigFormCollectionArrayDeepNested",
        {
          inputs: [
            [
              "0",
              ["1", ["2", ["3", ["46", ["5", ["69", ["77", ["800", ["9"]]]]]]]]]
            ]
          ]
        },
        true
      ); // Deep check
    });

    it("should reset the form to its initial state", () => {
      cy.getByDataTestId(
        "button",
        `BigFormCollectionArrayDeepNested-reset`
      ).click();

      cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
        "be.calledWithExactly",
        "onReset,consoleLogBigFormCollectionArrayDeepNested",
        {
          object: { object_1: { object_2: { object_input: "object_input" } } },
          inputs: [
            [
              "0",
              ["1", ["2", ["3", ["4", ["5", ["6", ["7", ["800", ["9"]]]]]]]]]
            ]
          ]
        },
        true
      ); // Deep check
    });

    it("should submit the form", () => {
      cy.getByDataTestId(
        "button",
        `BigFormCollectionArrayDeepNested-submit`
      ).click();

      cy.get("@consoleLogBigFormCollectionArrayDeepNested").should(
        "be.calledWithExactly",
        "onSubmit,consoleLogBigFormCollectionArrayDeepNested",
        {
          object: { object_1: { object_2: { object_input: "object_input" } } },
          inputs: [
            [
              "0",
              ["1", ["2", ["3", ["4", ["5", ["6", ["7", ["800", ["9"]]]]]]]]]
            ]
          ]
        },
        true
      ); // Deep check
    });
  });
});
