/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
const {
  Form,
  Input,
  useValidation,
  useField,
  Collection,
  useAsyncValidation,
  createFormStore
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
    setTimeout(() => {
      if (!value || !value.user || !value.user.mailList) {
        reject("Empty are not allowed");
        return;
      }

      if (!value.user.mailList[0]) {
        reject("Error values not allowed");
      } else {
        resolve("Success");
      }
    }, 1000);
  });

const [formStore, useSelector] = createFormStore();
const CustomFieldInputFooBefore = () => {
  const [value, setFieldValue] = useSelector(state => state.foo, { foo: 789 });
  const onChange = () => setFieldValue("123");

  return (
    <div>
      <pre>
        <span>FIELD 4 BEFORE FORM MOUNT:</span>{" "}
        <code>{JSON.stringify(value)}</code>
      </pre>
      <button type="button" onClick={onChange}>
        Change CustomFieldInputFooBefore
      </button>
    </div>
  );
};

const CustomFieldInputFooAfter = () => {
  const [value, setFormState] = useSelector(state => state.foo, { foo: 789 });
  const onChange = () => setFormState("999");

  return (
    <div>
      <pre>
        <span>FIELD 5 AFTER FORM MOUNT:</span>{" "}
        <code>{JSON.stringify(value)}</code>
      </pre>
      <button type="button" onClick={onChange}>
        Change CustomFieldInputFooAfter
      </button>
    </div>
  );
};

window.SimpleForm = () => {
  const [input, validationInput] = useValidation([
    val => (!val || (val && val.length <= 0) ? undefined : "error")
  ]);

  const [remove, setRemove] = useState(false);

  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);

  return (
    <div>
      {!remove && <CustomFieldInputFooBefore />}

      <Form
        formStore={formStore}
        onSubmit={state => console.log("onSubmit => ", state)}
        {...asyncValidation}
      >
        {asyncStatus.status === "asyncError" && (
          <label>{asyncStatus.value}</label>
        )}
        <Input type="text" value="789" name="foo" {...validationInput} />

        <Collection object name="user">
          <Collection array name="mailList">
            <Input type="text" />
            <Input type="text" />
          </Collection>
        </Collection>
        <Submit />
        <button type="submit">Subimt Form</button>

        <Reset />
      </Form>
      {!remove && <CustomFieldInputFooAfter />}

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
