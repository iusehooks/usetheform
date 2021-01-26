/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
const {
  Form,
  Input,
  useValidation,
  useField,
  Collection,
  useAsyncValidation
} = UseTheForm;

const { useState } = React;
const {
  CollectionArrayNested,
  Reset,
  Submit,
  CollectionValidationTouched
} = window;

const CustomField = ({ name, value = { a: "2" } }) => {
  const props = useField({ type: "custom", name, value });
  const onChange = () => props.onChange({ target: { value: { a: "1" } } });
  return (
    <div>
      <pre>
        <code>{JSON.stringify(props.value)}</code>
      </pre>
      <button type="button" onClick={onChange}>
        Change Value
      </button>
    </div>
  );
};

const asyncTest = value =>
  new Promise((resolve, reject) => {
    // it could be an API call or any async operation

    console.log("asyncTest", value.mailList);
    setTimeout(() => {
      if (!value && !value.user && !value.user.mailList) {
        reject("Empty are not allowed");
      }

      if (!value.user.mailList[0]) {
        reject("Error values not allowed");
      } else {
        resolve("Success");
      }
    }, 1000);
  });

window.SimpleForm = () => {
  const [input, validationInput] = useValidation([
    val => {
      return val && val.length > 3 ? undefined : "error";
    }
  ]);

  const [remove, setRemove] = useState(false);

  const [statusForm, validationFormProp] = useValidation([isArrayOfMailValid]);

  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);

  return (
    <div>
      <Form
        onSubmit={state => console.log("onSubmit => ", state)}
        {...asyncValidation}
      >
        {statusForm.error && <label>{statusForm.error}</label>}
        {asyncStatus.status === "asyncError" && (
          <label>{asyncStatus.value}</label>
        )}

        <Collection object name="user">
          <Collection array name="mailList">
            <Input data-testid="email1" type="text" />
            <Input data-testid="email2" type="text" />
          </Collection>
        </Collection>
        <Submit />
        <button type="submit">Press to see results</button>
        <Reset />
      </Form>

      <button onClick={() => setRemove(true)} type="button">
        Remove
      </button>
      {input.error && <label>{input.error}</label>}
    </div>
  );
};
function isArrayOfMailValid({ user }) {
  if (!user || !user.mailList || user.mailList.length <= 0) {
    return "Mail list empty";
  }

  return user.mailList.every(email =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
  )
    ? undefined
    : "Some Mails not Valid";
}
