/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection } = UseTheForm;

const { Reset, Submit, InputAsync, CollectionAsyncValidation, Email } = window;

const initialState = {
  username: "Antonio",
};

window.SimpleFormWithAsync = (props) => (
  <Form data-testid="form" initialState={initialState} {...props}>
    <CollectionAsyncValidation uniqueId="simpleFormWithAsync" />
    <Email />
    <InputAsync dataTestid="simpleFormWithAsyncInput1" name="username" />
    <Collection object name="address">
      <InputAsync
        name="city"
        value="Milan"
        dataTestid="simpleFormWithAsyncInput2"
      />
      <Collection array name="details">
        <InputAsync dataTestid="simpleFormWithAsyncInput3" value="333" />
      </Collection>
    </Collection>
    <Submit data_prefix="simpleFormWithAsync-" />
    <Reset data_prefix="simpleFormWithAsync-" />
  </Form>
);
