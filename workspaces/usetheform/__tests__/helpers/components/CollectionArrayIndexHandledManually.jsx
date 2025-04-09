import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef
} from "react";
import { Input, Collection } from "./../../../src";

export const CollectionArrayIndexHandledManually = forwardRef((props, ref) => {
  const { name = "indexManual" } = props;
  const innerState = useRef([]);

  const index = useRef(0);
  const [inputs, setAdd] = useState([]);

  const indexCollection = useRef(0);
  const [collections, setCollection] = useState([]);

  const addInput = () => {
    const myIndex = ++index.current;
    if (!innerState.current[0]) {
      innerState.current[0] = [];
    }
    setAdd(prev => {
      const pos = Math.floor(Math.random() * prev.length);
      const nextVal = [...prev];
      const value = `${myIndex}`;
      const nextInneState = [...innerState.current[0]];
      nextInneState.splice(pos, 0, value);
      innerState.current[0] = nextInneState;
      nextVal.splice(pos, 0, {
        value,
        key: value
      });
      return nextVal;
    });
  };

  const removeInput = () =>
    setAdd(prev => {
      const pos = Math.floor(Math.random() * prev.length);
      innerState.current[0] = innerState.current[0].filter(
        (val, index) => index !== pos
      );
      if (innerState.current[0].length === 0) {
        delete innerState.current[0];
      }
      return prev.filter((elm, index) => index !== pos);
    });

  const addCollection = () => {
    const myIndex = ++indexCollection.current;
    if (!innerState.current[1]) {
      innerState.current[1] = [];
    }

    setCollection(prev => {
      const pos = Math.floor(Math.random() * prev.length);
      const value = `${myIndex}`;
      const nextVal = [...prev];
      const nextInneState = [...innerState.current[1]];
      nextInneState.splice(pos, 0, [value]);
      innerState.current[1] = nextInneState;
      nextVal.splice(pos, 0, { value: [value], key: value });

      return nextVal;
    });
  };

  const removeCollection = () => {
    setCollection(prev => {
      const pos = Math.floor(Math.random() * prev.length);

      innerState.current[1] = innerState.current[1].filter(
        (val, index) => index !== pos
      );
      if (innerState.current[1].length === 0) {
        delete innerState.current[1];
      }

      return prev.filter((elm, index) => index !== pos);
    });
  };

  useImperativeHandle(ref, () => ({
    getInnerState() {
      return innerState.current;
    }
  }));

  return (
    <div>
      <Collection array name={name}>
        <Collection array>
          {inputs.map((inp, index) => (
            <Input
              type="text"
              index={index}
              key={inp.key}
              data-testid={`input_${inp.value}`}
              value={inp.value}
            />
          ))}
        </Collection>
        <br />
        <br />
        <Collection array>
          {collections.map((coll, index) => (
            <Collection array value={coll.value} index={index} key={coll.key}>
              <Input type="text" data-testid={`text_${coll.key}`} />
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
});
