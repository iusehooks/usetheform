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
  CollectionValidationTouched,
  CollectionNestedDynamicField
} = window;

window.SimpleForm = () => {
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

  const [input] = useValidation([
    val => (val && val.length > 3 ? undefined : "error")
  ]);

  const [statusForm, validationFormProp] = useValidation([isArrayOfMailValid]);

  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);

  return (
    <div>
      <Form
        data-testid="SimpleForm-Form"
        onSubmit={state => {
          console.log("onSubmit,consoleLogSimpleForm", state);
        }}
        onChange={state => console.log("onChange,consoleLogSimpleForm", state)}
        onReset={state => console.log("onReset,consoleLogSimpleForm", state)}
        onInit={(state, isValid) => {
          console.log("onInit,consoleLogSimpleForm", state, isValid);
        }}
        initialState={{
          jobTitle: "none",
          address: { city: "Milan", cap: "20093", info: ["via 1", "via 2"] }
        }}
        {...asyncValidation}
        {...validationFormProp}
      >
        {statusForm.error && (
          <label data-testid="SimpleForm-status-error">
            {statusForm.error}
          </label>
        )}
        {asyncStatus.status === "asyncError" && (
          <label data-testid="SimpleForm-async-test-error">
            {asyncStatus.value}
          </label>
        )}
        <br />
        <CollectionNestedDynamicField />
        <br /> <br />
        <CollectionArrayNested dataTestid="collectionArrayNested" />
        <br /> <br />
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
