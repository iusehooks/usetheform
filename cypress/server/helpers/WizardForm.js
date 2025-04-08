/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Input, useMultipleForm } = UseTheForm;

const { useState } = React;

window.WizardForm = () => {
  const [getWizardState, wizardApi] = useMultipleForm(state =>
    console.log("onChange,consoleLogWizardForm", state)
  );
  const [stateWizard, setStateWizard] = useState({});
  return (
    <div>
      <Form
        data-testid="WizardForm-form1"
        {...wizardApi}
        name="form1"
        initialState={{ name: "foo" }}
      >
        <Input data-testid="WizardForm-form1-name" type="text" name="name" />
      </Form>
      <Form
        data-testid="WizardForm-form2"
        {...wizardApi}
        name="form2"
        initialState={{ lastname: "mouse" }}
      >
        <Input
          data-testid="WizardForm-form2-lastname"
          type="text"
          name="lastname"
        />
      </Form>
      <button
        type="button"
        data-testid="WizardForm-getState"
        onClick={() => setStateWizard(getWizardState())}
      >
        Submit Wizard
      </button>
      <div>
        <code data-testid="WizardForm-code">{JSON.stringify(stateWizard)}</code>
      </div>
    </div>
  );
};
