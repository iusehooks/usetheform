/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input } = UseTheForm;

const {
  CollectionArrayNested,
  Reset,
  Submit,
  InputAsync,
  CollectionAsyncValidation,
  Email
} = window;

const initialState = {
  username: "Antonio"
};

window.SimpleFormWithAsync = props => (
  <Form data-testid="form" initialState={initialState} {...props}>
    <CollectionAsyncValidation />
    <Email />
    <InputAsync name="username" />
    <Collection object name="address">
      <InputAsync name="city" value="Milan" />
      <Collection array name="details">
        <InputAsync value="333" />
      </Collection>
    </Collection>
    <Submit />
    <Reset />
  </Form>
);
