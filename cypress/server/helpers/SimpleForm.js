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

const asyncTest = value =>
  new Promise((resolve, reject) => {
    // it could be an API call or any async operation

    setTimeout(() => {
      if (!value && !value.userInfo && !value.userInfo.mailList) {
        reject("Empty are not allowed");
      }

      if (
        value.userInfo &&
        value.userInfo.mailList &&
        !value.userInfo.mailList[0]
      ) {
        reject("Error values not allowed");
      } else {
        resolve("Success");
      }
    }, 1000);
  });

window.SimpleForm = () => {
  const [input] = useValidation([
    val => (val && val.length > 3 ? undefined : "error")
  ]);

  const [_omit, setRemove] = useState(false);

  const [statusForm, validationFormProp] = useValidation([isArrayOfMailValid]);

  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);

  return (
    <div>
      <Form
        onSubmit={state => console.log("onSubmit => ", state)}
        initialState={{
          jobTitle: "none",
          address: { city: "Milan", cap: "20093", info: ["via 1", "via 2"] }
        }}
        onChange={state => console.log("onChange => ", state)}
        onReset={state => console.log("onReset => ", state)}
        {...asyncValidation}
        {...validationFormProp}
      >
        {statusForm.error && (
          <label data-testid="status-error">{statusForm.error}</label>
        )}
        {asyncStatus.status === "asyncError" && (
          <label data-testid="async-test-error">{asyncStatus.value}</label>
        )}
        <Input data-testid="jobTitle" name="jobTitle" type="text" />

        <Collection object name="address">
          <Input data-testid="city" name="city" type="text" />
          <Input data-testid="cap" name="cap" type="text" />
          <Collection array name="info">
            <Input data-testid="line1" type="text" />
            <Input data-testid="line2" type="text" />
          </Collection>
        </Collection>

        <Collection
          object
          name="user"
          value={{ name: "Antonio", surname: "Pangallo", info: ["Male", "40"] }}
        >
          <Input data-testid="name" name="name" type="text" />
          <Input data-testid="surname" name="surname" type="text" />
          <Collection array name="info">
            <Input data-testid="gender" type="text" />
            <Input data-testid="age" type="text" />
          </Collection>
        </Collection>

        <Collection object name="userInfo">
          <Collection array name="mailList">
            <Input data-testid="email1" type="text" />
            <Input data-testid="email2" type="text" />
          </Collection>
        </Collection>
        <Submit data_prefix="simpleForm-" />
        <button type="submit">Press to see results</button>
        <Reset data_prefix="simpleForm-" />
      </Form>

      <button onClick={() => setRemove(true)} type="button">
        Remove
      </button>
      {input.error && <label>{input.error}</label>}
    </div>
  );
};
function isArrayOfMailValid({ userInfo }) {
  if (!userInfo || !userInfo.mailList || userInfo.mailList.length <= 0) {
    return "Mail list empty";
  }

  return userInfo.mailList.every(email =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
  )
    ? undefined
    : "Some Mails not Valid";
}
