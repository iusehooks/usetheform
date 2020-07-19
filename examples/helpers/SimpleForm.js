/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Input, Collection } = UseTheForm;

const { useState, useEffect, useRef } = React;
const { CollectionArrayNested, Reset } = window;
window.SimpleForm = ({ children }) => {
  const index = useRef(0);
  const indexColl = useRef(0);

  const [inputs, setAdd] = useState([]);
  const [collections, setCollection] = useState([]);

  return (
    <Form
      onChange={state => console.log(state)}
      onInit={state => console.log("onInit ", state)}
    >
      <Input type="file" name="file" />

      <Collection array name="check" value={[true]}>
        <Input type="radio" value={true} />

        <Input type="checkbox" />
      </Collection>

      <Collection array name="arrayNested">
        {" ------ "}
        {collections}
        <Collection array>
          {" --- Start --- "}
          <div> Start an array collection of inputs</div>
          {inputs}
          <div> End an array collection of inputs</div>
          {" --- End --- "}
        </Collection>
      </Collection>
      <button
        type="button"
        onClick={() =>
          setAdd(prev => {
            index.current++;
            const copy = [...prev];
            const pos = Math.floor(Math.random() * copy.length);
            copy.splice(
              pos,
              0,
              <Input type="text" key={index.current} value={index.current} />
            );

            return copy;
          })
        }
      >
        ADD INPUT
      </button>

      <button
        type="button"
        onClick={() =>
          setCollection(prev => {
            indexColl.current++;
            const copy = [...prev];
            const pos = Math.floor(Math.random() * copy.length);
            copy.splice(
              pos,
              0,
              <Collection array key={indexColl.current}>
                <Input type="text" value={indexColl.current} />
              </Collection>
            );
            return copy;
          })
        }
      >
        ADD Collection
      </button>

      <button
        type="button"
        onClick={() =>
          setAdd(prev => {
            const items = [...prev];
            delete items[Math.floor(Math.random() * items.length)];
            return items.filter(elm => typeof elm !== "undefined");
          })
        }
      >
        REMOVE RANDOM
      </button>

      <br />
      <br />

      <Reset />
    </Form>
  );
};
