/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Input } = UseTheForm;

const { useState } = React;

var foo = new Array(100); // create an empty array with length 45
for (var i = 0; i < foo.length; i++) {
  foo[i] = i;
}

window.BigForm = () => {
  const [inputs] = useState(() =>
    foo.map((item, index) => (
      <Input type="text" key={index} name={`c${index}`} />
    ))
  );

  return (
    <div>
      <Form>{inputs}</Form>
    </div>
  );
};
