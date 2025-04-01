/* eslint-disable react/react-in-jsx-scope */

const { Input, Collection } = UseTheForm;
const { useState, useRef, useImperativeHandle, forwardRef } = React;

const CollectionNestedDynamicField = forwardRef(
  ({ name = "dynamicNested" }, ref) => {
    const innerState = useRef({ name: [] });
    const index = useRef(0);
    const [inputs, setInputs] = useState([]);

    const indexCollection = useRef(0);
    const [collections, setCollections] = useState([]);

    const addInput = () => {
      index.current++;
      innerState.current.name.push(`${index.current}`);

      setInputs(prev => [
        ...prev,
        <Input
          type="text"
          key={index.current}
          data-testid={`input_${index.current}`}
          value={index.current}
          readOnly
        />
      ]);
    };

    const removeInput = () => {
      setInputs(prev => {
        if (prev.length === 0) return prev;
        const pos = Math.floor(Math.random() * prev.length);
        return prev.filter((_, i) => i !== pos);
      });
    };

    const addCollection = () => {
      indexCollection.current++;
      innerState.current.name.push(`${indexCollection.current}`);

      setCollections(prev => [
        ...prev,
        <Collection array={true} key={indexCollection.current}>
          <div>--- Start ---</div>
          <Input
            type="text"
            data-testid={`text_${indexCollection.current}`}
            value={indexCollection.current}
            readOnly
          />
          <div>--- End ---</div>
        </Collection>
      ]);
    };

    const removeCollection = () => {
      setCollections(prev => {
        if (prev.length === 0) return prev;
        const pos = Math.floor(Math.random() * prev.length);
        return prev.filter((_, i) => i !== pos);
      });
    };

    useImperativeHandle(ref, () => ({
      getInnerState: () => innerState.current
    }));

    return (
      <div>
        <Collection array={true} name={name}>
          <Collection array={true}>
            <div>--- Start ---</div>
            <div>Start an array collection of inputs</div>
            {inputs}
            <div>End an array collection of inputs</div>
            <div>--- End ---</div>
            {collections}
          </Collection>
        </Collection>
        <br />
        <button
          type="button"
          data-testid={`${name}_addInput`}
          onClick={addInput}
        >
          Add Input
        </button>
        <button
          type="button"
          data-testid={`${name}_removeInput`}
          onClick={removeInput}
        >
          Remove Random Input
        </button>
        <button
          type="button"
          data-testid={`${name}_addCollection`}
          onClick={addCollection}
        >
          Add Array Collection
        </button>
        <button
          type="button"
          data-testid={`${name}_removeCollection`}
          onClick={removeCollection}
        >
          Remove Random Collection
        </button>
      </div>
    );
  }
);

window.CollectionNestedDynamicField = CollectionNestedDynamicField;
