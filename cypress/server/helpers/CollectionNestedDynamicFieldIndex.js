/* eslint-disable react/react-in-jsx-scope */

const { Input, Collection } = UseTheForm;
const { useState, useRef } = React;

window.CollectionNestedDynamicFieldIndex = function ({
  name = "dynamicNestedIndex"
}) {
  const index = useRef(0);
  const [inputs, setAdd] = useState([]);

  const indexCollection = useRef(0);
  const [collections, setCollection] = useState([]);

  const addInput = () => {
    index.current++;

    setAdd(prev => {
      const pos = Math.floor(Math.random() * prev.length);
      const nextVal = [...prev];
      nextVal.splice(pos, 0, {
        value: `${index.current}`,
        key: `${index.current}`
      });
      return nextVal;
    });
  };

  const removeInput = () =>
    setAdd(prev => {
      const pos = Math.floor(Math.random() * prev.length);
      return prev.filter((elm, index) => index !== pos);
    });

  const addCollection = () => {
    indexCollection.current++;

    setCollection(prev => {
      const pos = Math.floor(Math.random() * prev.length);
      const nextVal = [...prev];
      nextVal.splice(pos, 0, {
        value: [`${indexCollection.current}`],
        key: `${indexCollection.current}`
      });
      return nextVal;
    });
  };

  const removeCollection = () => {
    setCollection(prev => {
      const pos = Math.floor(Math.random() * prev.length);
      return prev.filter((elm, index) => index !== pos);
    });
  };

  return (
    <div>
      <Collection array name={name}>
        <Collection array>
          {inputs.map((inp, index) => (
            <Input
              type="text"
              index={index}
              key={inp.key}
              data-testid={`input_${index}`}
              value={inp.value}
            />
          ))}
        </Collection>
        <br />
        <br />
        <Collection array>
          {collections.map((coll, index) => (
            <Collection array value={coll.value} index={index} key={coll.key}>
              <Input type="text" data-testid={`text_${index}`} />
            </Collection>
          ))}
        </Collection>
      </Collection>
      <br />
      <button type="button" data-testid="addInput" onClick={addInput}>
        Add Input
      </button>
      <button type="button" data-testid="removeInput" onClick={removeInput}>
        Remove random Input
      </button>
      <button type="button" data-testid="addCollection" onClick={addCollection}>
        Add array Collection
      </button>
      <button
        type="button"
        data-testid="removeCollection"
        onClick={removeCollection}
      >
        Remove random Collection
      </button>
    </div>
  );
};
