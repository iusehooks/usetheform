/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
const {
  Form,
  Input,
  useValidation,
  useField,
  Collection,
  useAsyncValidation,
  useForm
} = UseTheForm;

const { useState } = React;
const {
  CollectionArrayNested,
  Reset,
  Submit,
  CollectionValidationTouched,
  CollectionNestedDynamicField
} = window;

window.FormWithAction = () => {
  const asyncTest = value =>
    new Promise((resolve, reject) => {
      // it could be an API call or any async operation
      setTimeout(() => {
        const { userInfo = {}, agreement, file } = value;
        if (!agreement || !file) {
          reject("Missing Agreement or File!");
        } else {
          resolve("Success");
        }
      }, 1000);
    });
  const UseFormComponent = () => {
    const {
      state,
      isValid,
      pristine,
      submitted,
      submitAttempts,
      formStatus,
      reset
    } = useForm();

    return (
      <div>
        <h3>Form Status</h3>

        <div>
          <strong>Form Status:</strong>
          <label data-testid="FormWithAction-formStatus">{formStatus}</label>
        </div>

        <div>
          <strong>IsValid:</strong>
          <label data-testid="FormWithAction-isValid">
            {JSON.stringify(isValid)}
          </label>
        </div>

        <div>
          <strong>Submitted:</strong>
          <label data-testid="FormWithAction-submitted">{submitted}</label>
        </div>

        <div>
          <strong>Submit Attempts:</strong>
          <label data-testid="FormWithAction-submitAttempts">
            {submitAttempts}
          </label>
        </div>

        <div>
          <strong>Pristine:</strong>
          <label data-testid="FormWithAction-pristine">
            {JSON.stringify(pristine)}
          </label>
        </div>

        <div>
          <strong>State:</strong>
          <label data-testid="FormWithAction-state">
            {JSON.stringify(state)}
          </label>
        </div>

        <div>
          <strong>Reset:</strong>
          <button
            onClick={reset}
            type="button"
            data-testid="FormWithAction-reset-useform"
          >
            Reset
          </button>
        </div>
      </div>
    );
  };
  const [statusForm, validationFormProp] = useValidation([mandatoryFields]);

  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);

  return (
    <div>
      <Form
        action="/FormWithActionSubmit"
        method="post"
        enctype="multipart/form-data"
        data-testid="FormWithAction-Form"
        onSubmit={state => {
          console.log("onSubmit,consoleLogFormWithAction", state);
        }}
        onChange={state =>
          console.log("onChange,consoleLogFormWithAction", state)
        }
        onReset={state =>
          console.log("onReset,consoleLogFormWithAction", state)
        }
        onInit={(state, isValid) => {
          console.log("onInit,consoleLogFormWithAction", state, isValid);
        }}
        {...validationFormProp}
        {...asyncValidation}
      >
        {statusForm.error && (
          <label data-testid="FormWithAction-status-error">
            {statusForm.error}
          </label>
        )}
        {asyncStatus.status === "asyncError" && (
          <label data-testid="FormWithAction-async-status-error">
            {asyncStatus.value}
          </label>
        )}
        <br />
        <Collection object name="userInfo">
          Gender:
          <Input
            data-testid="FormWithAction-gender-m"
            name="gender"
            type="radio"
            value="M"
          />
          <Input
            data-testid="FormWithAction-gender-f"
            name="gender"
            type="radio"
            value="F"
          />
          Age:
          <Input
            data-testid="FormWithAction-age"
            type="number"
            name="age"
            value="18"
          />
        </Collection>
        <Input
          data-testid="FormWithAction-agreement"
          name="agreement"
          type="checkbox"
          value="1"
        />

        <Input data-testid="FormWithAction-file" name="file" type="file" />
        <UseFormComponent />
        <Submit data_prefix="FormWithAction-" />
        <button type="submit">Press to see results</button>
        <Reset data_prefix="FormWithAction-" />
      </Form>
    </div>
  );
};
function mandatoryFields({ userInfo }) {
  if (
    !userInfo ||
    !userInfo.gender ||
    !userInfo.age ||
    (userInfo.age && userInfo.age < 18)
  ) {
    return "Missing Mandatory Fields!";
  }

  return undefined;
}
