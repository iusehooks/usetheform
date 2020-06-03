/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Input } = UseTheForm;

window.SimpleForm = ({ children }) => (
  <Form>
    <Input type="text" name="form" value="1" />
  </Form>
);
