/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input, useField } = UseTheForm;

const { useState, useEffect, useRef } = React;
const { CollectionArrayNested, Reset } = window;

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
