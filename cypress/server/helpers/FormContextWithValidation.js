const {
  FormContext,
  useValidation,
  useAsyncValidation,
  useForm,
  Input
} = UseTheForm;

const { Submit } = window;

window.FormContextWithValidation = (() => {
  // Inner form wrapper component
  function FormWithContext({ children }) {
    const { onSubmitForm } = useForm();

    return (
      <form
        data-testid="FormContextWithValidation-Form"
        onSubmit={onSubmitForm}
      >
        {children}
      </form>
    );
  }

  // This is the component returned by the IIFE
  return function FormContextWithValidation(props) {
    const validators = [
      ({ test = "" }) => (test.trim() === "" ? "required" : undefined)
    ];

    const asyncValidatorFunc = ({ test = "" }) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          test.length <= 5 ? reject("error") : resolve("Success");
        }, 2000);
      });

    const [status, formValidationProp] = useValidation(validators);
    const [asyncStatus, asyncValidation] = useAsyncValidation(asyncValidatorFunc);

    return (
      <div>
        <FormContext
          onSubmit={(state) => console.log(state)}
          touched
          {...props}
          {...formValidationProp}
          {...asyncValidation}
        >
          <FormWithContext>
            <Input type="text" name="test" data-testid="test" />
            <Submit />
          </FormWithContext>
        </FormContext>

        {status.error && (
          <label data-testid="errorLabel">{status.error}</label>
        )}

        {asyncStatus.status === "asyncStart" && (
          <label data-testid="FormContextWithValidation-asyncStart">
            Checking...
          </label>
        )}

        {asyncStatus.status === "asyncSuccess" && (
          <label data-testid="FormContextWithValidation-asyncSuccess">
            {asyncStatus.value}
          </label>
        )}

        {asyncStatus.status === "asyncError" && (
          <label data-testid="FormContextWithValidation-asyncError">
            {asyncStatus.value}
          </label>
        )}
      </div>
    );
  };
})();
