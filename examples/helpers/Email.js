/* eslint-disable react/react-in-jsx-scope */
const { Input, useValidation } = UseTheForm;

const email = value =>
  !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
    ? undefined
    : "Mail not Valid";
const required = value => (value && value !== "" ? undefined : "Required");

window.Email = function({ name = "email", value }) {
  const [status, validation] = useValidation([required, email]);
  return (
    <div>
      <label>Email: </label>
      <Input
        touched
        name={name}
        type="text"
        data-testid="email"
        value={value}
        {...validation}
      />
      {status.error && <label>{status.error}</label>}
    </div>
  );
};
