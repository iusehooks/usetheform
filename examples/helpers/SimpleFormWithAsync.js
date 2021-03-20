/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection } = UseTheForm;

const { Reset, Submit, InputAsync, CollectionAsyncValidation, Email } = window;

const initialState = {
  username: ""
};

window.SimpleFormWithAsync = props => (
  <Form data-testid="formWithAsync" initialState={initialState} {...props}>
    <CollectionAsyncValidation />
    <Email />
    <InputAsync name="username" />
    <Collection object name="address">
      <InputAsync name="city" value="" />
      <Collection array name="details">
        <InputAsync value="" />
      </Collection>
    </Collection>
    <Submit />
    <Reset />
  </Form>
);
