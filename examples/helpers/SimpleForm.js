/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input, useField } = UseTheForm;

const { useState, useEffect, useRef } = React;
const { CollectionArrayNested, Reset } = window;

const InputCustomNoAutoIndex = ({ type, name, value, index, ...restAttr }) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
};

window.SimpleForm = () => {
  const [inputs, setAdd] = useState([]);
  const [collections, addCollection] = useState([]);

  return (
    <div>
      <Form
        onChange={state => console.log(state)}
        onInit={state => console.log("onInit ", state)}
      >
        <Collection array name="check">
          <Collection array>
            <Input type="text" value="gg" />
          </Collection>
          <label>
            Input 1: <Input type="text" value="5" />
          </label>

          <Input type="text" value="4" />
          {inputs}
          {collections}
        </Collection>

        {/* <CollectionArrayNested /> */}
        <Reset />
      </Form>
      <button
        onClick={() =>
          setAdd(prev => [
            ...prev,
            <Input type="text" key={prev.length} value={prev.length} />
          ])
        }
      >
        Add Input
      </button>

      <button
        onClick={() =>
          addCollection(prev => [
            ...prev,
            <Collection key={prev.length}>
              <Input type="text" value={prev.length} />
            </Collection>
          ])
        }
      >
        Add Collection
      </button>

      <button
        onClick={() =>
          addCollection(prev => {
            const pos = Math.floor(Math.random() * prev.length);
            return prev.filter((elm, index) => index !== pos);
          })
        }
      >
        Remove Collection
      </button>

      <button onClick={() => set(prev => !prev)}>remove Input</button>
    </div>
  );
};
