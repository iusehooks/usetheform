/* eslint-disable react/react-in-jsx-scope */

const { Input, Collection } = UseTheForm;
const { useState, useRef } = React;

window.CollectionNestedDynamicField = function ({ name = "dynamicNested" }) {
  const index = useRef(0);
  const [inputs, setAdd] = useState([]);

  const indexCollection = useRef(0);
  const [collections, setCollection] = useState([]);

  const addInput = () => {
    index.current++;
    setAdd(prev => [
      ...prev,
      <Input
        type="text"
        key={index.current}
        data-testid={`input_${index.current}`}
        value={index.current}
      />
    ]);
  };

  const removeInput = () =>
    setAdd(prev => {
      const pos = Math.floor(Math.random() * prev.length);

      return prev.filter((elm, index) => index !== pos);
    });

  const addCollection = () => {
    indexCollection.current++;
    setCollection(prev => [
      ...prev,
      <Collection array key={indexCollection.current}>
        {" --- Start --- "}
        <Input
          type="text"
          data-testid={`text_${indexCollection.current}`}
          value={indexCollection.current}
        />
        {" --- End --- "}
      </Collection>
    ]);
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
          {" --- Start --- "}
          <div> Start an array collection of inputs</div>
          {inputs}
          <div> End an array collection of inputs</div>
          {" --- End --- "}
          {collections}
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
