/* eslint-disable react/react-in-jsx-scope */
const { Form, Collection, Input, useField, useValidation } = UseTheForm;

const { useState, useEffect, useRef } = React;
const {
  CollectionArrayNested,
  Reset,
  Submit,
  CollectionValidationTouched
} = window;

const InputCustomNoAutoIndex = ({ type, name, value, index, ...restAttr }) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
};

window.SimpleForm = () => {
  const [input, validationInput] = useValidation([
    val => {
      return val && val.length > 3 ? undefined : "erro";
    }
  ]);

  const [remove, setRemove] = useState(false);

  return (
    <div>
      <Form>
        <CollectionArrayNested />
        <Submit forceEnable />
        <Reset />
      </Form>
      <br />
      <br />
      <Form>
        {!remove && <CollectionValidationTouched />}
        {!remove && (
          <Input type="text" name="ABC" value="3" {...validationInput} />
        )}
        <Submit forceEnable />
        <Reset />
      </Form>
      <button onClick={() => setRemove(true)} type="button">
        setRemove
      </button>
      {input.error && <label>{input.error}</label>}
    </div>
  );
};
