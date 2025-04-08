const reactVersions = ["16.13.0", "17.0.2", "18.3.1", "19.0.0"];

reactVersions.forEach(version => {
  describe(`Tests for SimpleForm - React ${version}`, () => {
    beforeEach(() => {
      cy.window().then(win => {
        const consoleSpy = cy.spy(win.console, "log");
        cy.wrap(consoleSpy).as("consoleLogSimpleForm");
      });
    });

    afterEach(() => {
      cy.get("@consoleLogSimpleForm").then(consoleLogSimpleForm => {
        consoleLogSimpleForm.restore();
      });
    });

    before(() => {
      cy.visit(`/index_react_${version}.html?form=SimpleForm`);
    });

    it("should display the correct initial setup", () => {
      cy.getByDataTestId("form", "SimpleForm-Form").should("exist");
      cy.get("@consoleLogSimpleForm").should(
        "be.calledWithExactly",
        "onInit,consoleLogSimpleForm",
        defaultInitialState,
        false
      ); // Deep check

      cy.getByDataTestId("label", "SimpleForm-status-error")
        .should("exist")
        .contains("Mail list empty");
      cy.getByDataTestId("button", "simpleForm-submit").should("be.disabled");
      cy.getByDataTestId("button", "simpleForm-reset").should("be.disabled");
    });

    it("should have correct default form values", () => {
      const defaultValues = {
        jobTitle: "none",
        line1: "via 1",
        line2: "via 2",
        name: "Antonio",
        surname: "Pangallo",
        gender: "Male",
        age: "40"
      };

      Object.entries(defaultValues).forEach(([field, value]) => {
        cy.getByDataTestId("input", field)
          .should("not.be.disabled")
          .should("have.value", value);
      });

      for (let i = 1; i <= 10; i++) {
        cy.getByDataTestId("input", `collectionArrayNested_${i}`)
          .should("not.be.disabled")
          .should("have.value", `input${i}`);
      }
    });

    it("should reset email fields properly", () => {
      cy.getByDataTestId("input", "email2").type("John");
      cy.getByDataTestId("button", "simpleForm-reset").should(
        "not.be.disabled"
      );
      cy.getByDataTestId("label", "SimpleForm-status-error")
        .should("exist")
        .contains("Some Mails not Valid");

      cy.getByDataTestId("input", "email1").type("Sam");
      cy.getByDataTestId("button", "simpleForm-reset").click();

      ["email1", "email2"].forEach(field => {
        cy.getByDataTestId("input", field).should("have.value", "");
      });

      ["simpleForm-submit", "simpleForm-reset"].forEach(button => {
        cy.getByDataTestId("button", button).should("be.disabled");
      });

      cy.get("@consoleLogSimpleForm").should(
        "be.calledWithExactly",
        "onReset,consoleLogSimpleForm",
        defaultInitialState
      ); // Deep check
    });

    it("should not submit the form if the first email is missing", () => {
      cy.getByDataTestId("input", "email2").clear().type("johndoe@gmail.com");
      cy.getByDataTestId("button", "simpleForm-submit").click();
      cy.getByDataTestId("label", "SimpleForm-async-test-error")
        .should("exist")
        .contains("Error values not allowed");
    });

    it("should submit the form successfully with valid emails", () => {
      ["email1", "email2"].forEach((field, index) => {
        cy.getByDataTestId("input", field)
          .clear()
          .type(index === 0 ? "johndoe@gmail.com" : "joesmith@gmail.com");
      });

      cy.get("@consoleLogSimpleForm").should(
        "be.calledWithExactly",
        "onChange,consoleLogSimpleForm",
        {
          ...defaultInitialState,
          userInfo: {
            mailList: ["johndoe@gmail.com", "joesmith@gmail.com"]
          }
        }
      ); // Deep check

      ["dynamicNested_addInput", "dynamicNested_addCollection"].forEach(
        button => {
          cy.getByDataTestId("button", button).click().click();
        }
      );

      cy.get("@consoleLogSimpleForm").should(
        "be.calledWithExactly",
        "onChange,consoleLogSimpleForm",
        {
          ...defaultInitialState,
          dynamicNested: [[1, 2, [1], [2]]],
          userInfo: {
            mailList: ["johndoe@gmail.com", "joesmith@gmail.com"]
          }
        }
      ); // Deep check

      cy.getByDataTestId("button", "simpleForm-submit")
        .should("not.be.disabled")
        .click();

      cy.get("@consoleLogSimpleForm").should(
        "be.calledWithExactly",
        "onSubmit,consoleLogSimpleForm",
        formOutput
      ); // Deep check
    });
  });
});

const formOutput = {
  jobTitle: "none",
  address: {
    city: "Milan",
    cap: "20093",
    info: ["via 1", "via 2"]
  },
  collectionArrayNested: [
    "input1",
    "input2",
    [
      "input3",
      "input4",
      ["input5", "input6", ["input7", "input8", ["input9", "input10"]]]
    ]
  ],
  user: {
    name: "Antonio",
    surname: "Pangallo",
    info: ["Male", "40"]
  },
  dynamicNested: [[1, 2, [1], [2]]],
  userInfo: {
    mailList: ["johndoe@gmail.com", "joesmith@gmail.com"]
  }
};

const defaultInitialState = {
  jobTitle: "none",
  address: {
    city: "Milan",
    cap: "20093",
    info: ["via 1", "via 2"]
  },
  collectionArrayNested: [
    "input1",
    "input2",
    [
      "input3",
      "input4",
      ["input5", "input6", ["input7", "input8", ["input9", "input10"]]]
    ]
  ],
  user: {
    name: "Antonio",
    surname: "Pangallo",
    info: ["Male", "40"]
  }
};
