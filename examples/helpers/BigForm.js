/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input, useField } = UseTheForm;

const { useState, useEffect, useRef } = React;
const { CollectionArrayNested, Reset } = window;

const InputCustomNoAutoIndex = ({ type, name, value, index, ...restAttr }) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
};

var foo = new Array(100); // create an empty array with length 45
for (var i = 0; i < foo.length; i++) {
  foo[i] = i;
}

window.SimpleForm = () => {
  const [inputs1, setAdd1] = useState(() =>
    foo.map((item, index) => (
      <Collection key={index} array name={`c${index}`}>
        <Input type="text" value={index} />
      </Collection>
    ))
  );

  const [inputs2, setAdd2] = useState(() =>
    foo.map((item, index) => (
      <Input type="text" key={index} name={`c${index}`} />
    ))
  );

  const [inputs, setAdd] = useState(() => []);
  const [collections, addCollection] = useState([]);

  return (
    <div>
      <Form>{inputs2}</Form>
    </div>
  );
};
