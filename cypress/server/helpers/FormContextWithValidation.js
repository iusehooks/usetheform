/* eslint-disable react/react-in-jsx-scope */
const {
  FormContext,
  useValidation,
  useAsyncValidation,
  useForm,
  Input
} = UseTheForm;

const { Submit } = window;

const validators = [
  ({ test = "" }) => (test.trim() === "" ? "required" : undefined)
];

const asyncValidatorFunc = ({ test = "" }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      test.length <= 5 ? reject("error") : resolve("Success");
    }, 2000);
  });

window.FormContextWithValidation = function ({ ...restProp }) {
  const [status, formValidationProp] = useValidation(validators);
  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncValidatorFunc);

  return (
    <div>
      <FormContext
        onSubmit={state => console.log(state)}
        touched
        {...restProp}
        {...formValidationProp}
        {...asyncValidation}
      >
        <Form>
          <Input type="text" name="test" data-testid="test" />
          <Submit />
        </Form>
      </FormContext>
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
      {asyncStatus.status === "asyncStart" && (
        <label data-testid="asyncStart">Checking...</label>
      )}
      {asyncStatus.status === "asyncSuccess" && (
        <label data-testid="asyncSuccess">{asyncStatus.value}</label>
      )}
      {asyncStatus.status === "asyncError" && (
        <label data-testid="asyncError">{asyncStatus.value}</label>
      )}
    </div>
  );
};

function Form({ children }) {
  const { onSubmitForm } = useForm();
  return <form onSubmit={onSubmitForm}>{children}</form>;
}
