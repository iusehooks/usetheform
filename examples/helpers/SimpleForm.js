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

      <Collection array name="check" value={[true, 1]}>
        <Input type="radio" value={true} />

        <Input type="checkbox" checked={false} />
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
        {/* <Collection array>
          {""}
          <Input type="text" value="1" />

          {inputs}
          <div> other children </div>
          <Input type="text" value="3" />
          <Collection object>
            <Input
              type="text"
              name="test"
              value="a"
              reducers={(state, prev) => {
                console.log("pippo prev - ", prev);
                console.log("pippo state  ", state);
                return state + 1;
              }}
            />
          </Collection>
        </Collection>
        <div> other children </div>*/}
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
      {/* <Collection array name="arrayNested1">
        <Input type="text" value="2" />
        <Collection array>
          <Input type="text" value="3" />
        </Collection>
      </Collection>

        <CollectionArrayNested />
      <Input
        type="text"
        name="test"
        value="ciccio1"
        reducers={(state, prev) => {
          console.log("prev - ", prev);
          console.log("state  ", state);
          return state;
        }}
      />
      <Collection object name="pippo">
        <Input
          type="text"
          name="test"
          value="a"
          reducers={(state, prev) => {
            console.log("pippo prev - ", prev);
            console.log("pippo state  ", state);
            return state + 1;
          }}
        />
      </Collection>

      <Collection array name="arrayNested"  >
        <Input type="text" value="input1" />
        <Input type="text" value="input2" />
      </Collection>

      <Collection
        name="nested"
        array
        value={[
          3,
          [2, [4, { mostinner: "hello", mostinnerarray: ["mostinnerarray"] }]]
        ]}
      >
        <Input type="text" />
        <Collection array>
          <Input type="text" />
          <Collection array>
            <Input type="text" />
            <Collection object>
              <Input name="mostinner" type="text" />
              <Collection name="mostinnerarray" array>
                <Input type="text" />
              </Collection>
            </Collection>
          </Collection>
        </Collection>
      </Collection>
      <br />
      <br />
      <br />
      {/* <Collection name="nestedsimple" array value={[6, 7]}>
        <Input type="text" />
        <Input type="text" />
      </Collection>
      <br />
      <br />

      <CollectionArrayNested />*/}

      <Reset />
    </Form>
  );
};
