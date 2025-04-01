/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input } = UseTheForm;

const { useState } = React;

let fooBigFormCollection = new Array(100); // create an empty array with length 45
for (let i = 0; i < fooBigFormCollection.length; i++) {
  fooBigFormCollection[i] = i;
}

window.BigFormCollection = () => {
  const [inputs] = useState(() =>
    fooBigFormCollection.map((item, index) => (
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
