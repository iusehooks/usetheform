const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for BigFormCollectionObjectDeepNested - React ${version}`, () => {
    before(() => {
      cy.visit(
        `/index_react_${version}.html?form=BigFormCollectionObjectDeepNested`
      );
    });

    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogBigFormCollectionObjectDeepNested");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogBigFormCollectionObjectDeepNested").then(console => {
        console.restore();
      });
    });

    it("should BigFormCollectionObjectDeepNested Form contains 10 text input fields", () => {
      const expected = JSON.parse(JSON.stringify(helperObject));
      cy.getByDataTestId(
        "form",
        "BigFormCollectionObjectDeepNested-Form"
      ).should("exist");

      cy.get("@consoleLogBigFormCollectionObjectDeepNested").should(
        "be.calledWithExactly",
        "onInit,consoleLogBigFormCollectionObjectDeepNested",
        {
          inputs: JSON.parse(JSON.stringify(expected))
        },
        true
      ); // Deep check

      for (let i = 0; i < 10; i++) {
        cy.getByDataTestId(
          "input",
          `BigFormCollectionObjectDeepNested-input-${i}`
        )
          .should("exist")
          .and("have.value", `${i}`);
      }
    });

    it("should clear the value of all input fields", () => {
      const current = JSON.parse(JSON.stringify(helperObject));
      let node = current;
      let level = 0;

      while (node) {
        const key = `object_${level}`;
        const inputKey = `${key}_input`;
        if (node[key]) {
          cy.getByDataTestId(
            "input",
            `BigFormCollectionObjectDeepNested-input-${level}`
          ).clear();
          delete node[key][inputKey];
          if (level !== 9) {
            cy.get("@consoleLogBigFormCollectionObjectDeepNested").should(
              "be.calledWithExactly",
              "onChange,consoleLogBigFormCollectionObjectDeepNested",
              {
                inputs: JSON.parse(JSON.stringify(current))
              },
              false
            ); // Deep check
          } else {
            cy.get("@consoleLogBigFormCollectionObjectDeepNested").should(
              "be.calledWithExactly",
              "onChange,consoleLogBigFormCollectionObjectDeepNested",
              {},
              false
            ); // Deep check
          }
          node = node[key]; // go deeper
          level++;
        } else {
          break; // no deeper object found
        }
      }
    });

    it("should fill the value of all input fields", () => {
      const current = {};
      let index = current;

      for (let i = 0; i < 10; i++) {
        cy.getByDataTestId(
          "input",
          `BigFormCollectionObjectDeepNested-input-${i}`
        ).type(`${i}`);

        index[`object_${i}`] = {
          [`object_${i}_input`]: `${i}`
        };
        index = index[`object_${i}`];

        cy.get("@consoleLogBigFormCollectionObjectDeepNested").should(
          "be.calledWithExactly",
          "onChange,consoleLogBigFormCollectionObjectDeepNested",
          {
            inputs: JSON.parse(JSON.stringify(current))
          },
          i === 9
        ); // Deep check
      }
    });

    it("should fill the value of all input fields randomly", () => {
      const current = JSON.parse(JSON.stringify(helperObject));
      const randomNumbers = getThreeUniqueRandomNumbers();

      let node = current;
      let level = 0;

      function fillNextLevel(node, level) {
        const key = `object_${level}`;
        const inputKey = `${key}_input`;

        if (!node[key] || level > 9) return;

        if (randomNumbers.includes(level)) {
          const testId = `BigFormCollectionObjectDeepNested-input-${level}`;
          cy.getByDataTestId("input", testId)
            .invoke("val")
            .then(inputValue => {
              cy.getByDataTestId("input", testId)
                .type(`${level}`, { force: true })
                .then(() => {
                  node[key][inputKey] = `${inputValue}${level}`;

                  cy.get("@consoleLogBigFormCollectionObjectDeepNested").should(
                    "be.calledWithExactly",
                    "onChange,consoleLogBigFormCollectionObjectDeepNested",
                    {
                      inputs: JSON.parse(JSON.stringify(current))
                    },
                    false
                  );
                  // Go to next level after everything's done
                  fillNextLevel(node[key], level + 1);
                });
            });
        } else {
          // If level not in randomNumbers, skip typing but go deeper
          fillNextLevel(node[key], level + 1);
        }
      }
      fillNextLevel(node, level);
    });

    it("should reset the form to its initial state", () => {
      cy.getByDataTestId(
        "button",
        `BigFormCollectionObjectDeepNested-reset`
      ).click();

      cy.get("@consoleLogBigFormCollectionObjectDeepNested").should(
        "be.calledWithExactly",
        "onReset,consoleLogBigFormCollectionObjectDeepNested",
        {
          inputs: JSON.parse(JSON.stringify(helperObject))
        },
        true
      ); // Deep check
    });

    it("should submit the form", () => {
      cy.getByDataTestId(
        "button",
        `BigFormCollectionObjectDeepNested-submit`
      ).click();

      cy.get("@consoleLogBigFormCollectionObjectDeepNested").should(
        "be.calledWithExactly",
        "onSubmit,consoleLogBigFormCollectionObjectDeepNested",
        {
          inputs: JSON.parse(JSON.stringify(helperObject))
        },
        true
      ); // Deep check
    });
  });
});

const helperObject = {
  object_0: {
    object_0_input: "0",
    object_1: {
      object_1_input: "1",
      object_2: {
        object_2_input: "2",
        object_3: {
          object_3_input: "3",
          object_4: {
            object_4_input: "4",
            object_5: {
              object_5_input: "5",
              object_6: {
                object_6_input: "6",
                object_7: {
                  object_7_input: "7",
                  object_8: {
                    object_8_input: "8",
                    object_9: {
                      object_9_input: "9"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
function getThreeUniqueRandomNumbers() {
  const numbers = Array.from({ length: 10 }, (_, i) => i); // [0,1,2,...9]

  // Shuffle the array
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers.slice(0, 3); // Get the first 3 unique numbers
}
