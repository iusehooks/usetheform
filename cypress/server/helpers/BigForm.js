/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Input } = UseTheForm;

const { useState } = React;

let fooBigForm = new Array(100); // create an empty array with length 45
for (let i = 0; i < fooBigForm.length; i++) {
  fooBigForm[i] = i;
}

window.BigForm = () => {
  const [inputs] = useState(() =>
    fooBigForm.map((item, index) => (
      <Input
        type="text"
        key={index}
        data-testid={`bigForm-input-${index}`}
        name={`c${index}`}
      />
    ))
  );

  return (
    <div>
      <Form data-testid="bigForm-form">{inputs}</Form>
    </div>
  );
};
