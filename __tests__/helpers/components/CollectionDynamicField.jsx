import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef
} from "react";
import { Collection, Input } from "../../../src";

export function CollectionDynamicField({ name = "dynamic" }) {
  const index = useRef(0);
  const [inputs, setAdd] = useState([]);

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

  return (
    <div>
      <Collection array name={name}>
        {" --- Start --- "}
        <div> Start an array collection of inputs</div>
        {inputs}
        <div> End an array collection of inputs</div>
        {" --- End --- "}
      </Collection>
      <br />
      <button type="button" data-testid="addInput" onClick={addInput}>
        Add Input
      </button>
      <button type="button" data-testid="removeInput" onClick={removeInput}>
        Remove random Input
      </button>
    </div>
  );
}

export function CollectionNestedDynamicField({ name = "dynamicNested" }) {
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
}

export function CollectionNestedRadioCheckbox({
  name = "dynamicRadioCheckbox"
}) {
  const index = useRef(0);
  const [inputs, setAdd] = useState([]);

  const indexCollection = useRef(0);
  const [collections, setCollection] = useState([]);

  const addInput = () => {
    index.current++;
    setAdd(prev => [
      ...prev,
      <Input
        type="checkbox"
        key={index.current}
        data-testid={`checkbox_${index.current}`}
        checked
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
          type="radio"
          checked
          data-testid={`radio_${indexCollection.current}`}
          value={indexCollection.current}
        />
        {" --- End --- "}
      </Collection>
    ]);
  };

  const removeCollection = () => {
    setCollection(prev => {
      const items = [...prev];
      delete items[Math.floor(Math.random() * items.length)];
      return items.filter(elm => typeof elm !== "undefined");
    });
  };

  return (
    <div>
      <Collection array name={name}>
        <Collection array>
          {" --- Start --- "}
          <div> Start an array collection of inputs checkboxes</div>
          {inputs}
          <div> End an array collection of inputs radios</div>
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
}

export const CollectionNestedRandomPosition = forwardRef((props, ref) => {
  const { name = "dynamicRandomPosition" } = props;
  const innerState = useRef([]);

  const index = useRef(0);
  const [inputs, setAdd] = useState([]);

  useImperativeHandle(ref, () => ({
    getInnerState() {
      return innerState.current;
    },
    setInnerState(state) {
      innerState.current = state;
    },
    setValue(index, value) {
      innerState.current[index] = value;
    }
  }));

  const addInput = () => {
    index.current++;
    innerState.current.push(index.current);

    setAdd(prev => {
      const newState = [
        ...prev,
        <Input
          type="text"
          key={index.current}
          data-testid={`input_${index.current}`}
          value={index.current}
        />
      ];

      return newState;
    });
  };

  const removeInput = () => {
    const pos = Math.floor(Math.random() * inputs.length);
    innerState.current.splice(pos, 1);
    setAdd(prev => prev.filter((val, index) => index !== pos));
  };

  return (
    <div>
      <Collection array name={name}>
        {" --- Start --- "}
        <div> Start an array collection of inputs</div>
        {inputs}
        <div> End an array collection of inputs</div>
        {" --- End --- "}
      </Collection>
      <br />
      <button type="button" data-testid="addInput" onClick={addInput}>
        Add Input
      </button>
      <button type="button" data-testid="removeInput" onClick={removeInput}>
        Remove random Input
      </button>
    </div>
  );
});

export const CollectionNestedRandomPositionCollection = forwardRef(
  (props, ref) => {
    const { name = "dynamicRandomPosition" } = props;
    const innerState = useRef([]);

    const index = useRef(0);
    const [inputs, setAdd] = useState([]);

    useImperativeHandle(ref, () => ({
      getInnerState() {
        return innerState.current;
      },
      setInnerState(state) {
        innerState.current = state;
      },
      setValue(index, value) {
        innerState.current[index] = value;
      }
    }));

    const addCollection = () => {
      index.current++;
      innerState.current.push([index.current]);
      setAdd(prev => {
        const newState = [
          ...prev,
          <Collection array key={index.current}>
            <div>some label</div>
            <Input
              type="text"
              data-testid={`input_${index.current}`}
              value={index.current}
            />
          </Collection>
        ];

        return newState;
      });
    };

    const removeCollection = () => {
      const pos = Math.floor(Math.random() * inputs.length);
      innerState.current.splice(pos, 1);
      setAdd(prev => prev.filter((val, index) => index !== pos));
    };

    return (
      <div>
        <Collection array name={name}>
          {" --- Start --- "}
          <div> Start an array collection of inputs</div>
          <Collection array>{inputs}</Collection>
          <div> End an array collection of inputs</div>
          {" --- End --- "}
        </Collection>
        <br />
        <button
          type="button"
          data-testid="addCollection"
          onClick={addCollection}
        >
          Add Collection of Inputs at Random postion
        </button>
        <button
          type="button"
          data-testid="removeCollection"
          onClick={removeCollection}
        >
          Remove Collection of Inputs at Random postion
        </button>
      </div>
    );
  }
);
