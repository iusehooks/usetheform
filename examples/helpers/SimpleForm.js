/* eslint-disable react/react-in-jsx-scope */
const { Form, Input, useValidation, useField } = UseTheForm;

const { useState } = React;
const {
  CollectionArrayNested,
  Reset,
  Submit,
  CollectionValidationTouched
} = window;

const CustomField = ({ name, value = { a: "2" } }) => {
  const props = useField({ type: "custom", name, value });
  const onChange = () => props.onChange({ target: { value: { a: "1" } } });
  return (
    <div>
      <pre>
        <code>{JSON.stringify(props.value)}</code>
      </pre>
      <button type="button" onClick={onChange}>
        Change Value
      </button>
    </div>
  );
};

window.SimpleForm = () => {
  const [input, validationInput] = useValidation([
    val => {
      return val && val.length > 3 ? undefined : "error";
    }
  ]);

  const [remove, setRemove] = useState(false);

  return (
    <div>
      <Form onChange={state => console.log(state)}>
        <CustomField name="custom" />
        <CollectionArrayNested />
        <Input type="file" name="fileMultiple" multiple />
        <Input type="file" name="fileSingle" />
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
        Remove
      </button>
      {input.error && <label>{input.error}</label>}
    </div>
  );
};
