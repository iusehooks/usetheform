/* eslint-disable react/react-in-jsx-scope */
const { Input, Collection } = UseTheForm;

window.User = function User({ name }) {
  return (
    <div data-testid="member">
      <label>User : </label>
      <Collection object name={name}>
        <Input name="name" data-testid="member_name" type="text" />
        <Input name="lastname" data-testid="member_lastname" type="text" />
      </Collection>
    </div>
  );
};
