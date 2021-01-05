/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input } = UseTheForm;

const { useState } = React;

var foo = new Array(100); // create an empty array with length 45
for (var i = 0; i < foo.length; i++) {
  foo[i] = i;
}

window.BigFormCollection = () => {
  const [inputs] = useState(() =>
    foo.map((item, index) => (
      <Collection array key={index} name={`c${index}`}>
        <Input type="text" />
      </Collection>
    ))
  );

  return (
    <div>
      <Form>{inputs}</Form>
    </div>
  );
};
