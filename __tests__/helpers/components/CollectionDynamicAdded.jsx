import React, { useRef } from "react";
import { Input, Collection, useValidation, useChildren } from "./../../../src";

const onlyNumber = value => {
  return value && !isNaN(value) ? undefined : "Error Only number";
};

const onlyNumberCollection = value => {
  return value && value.every(elm => !isNaN(elm))
    ? undefined
    : "Error Only number Collection";
};

export default function CollectionDynamicAdded() {
  const [status, attrValidation] = useValidation([onlyNumber]);

  const [statusCollection, attrCollectionValidation] = useValidation([
    onlyNumberCollection
  ]);

  const [collections, setCollection] = useChildren([]);
  const index = useRef(0);
  const addCollection = () => {
    index.current = index.current + 1;
    setCollection(prev => [
      ...prev,
      {
        index: index.current,
        nameInput: `input${index.current}`,
        attrValidation
      }
    ]);
  };

  const removeCollection = () => {
    setCollection(prev => prev.slice(0, prev.length - 1));
  };

  return (
    <div>
      <label>Inputs: (Async Validation) </label>
      <br />
      <button type="button" data-testid="addCollection" onClick={addCollection}>
        addCollection
      </button>
      <button
        type="button"
        data-testid="removeCollection"
        onClick={removeCollection}
      >
        removeCollection
      </button>
      <br />
      <Collection array name="wrapper">
        {collections.map(attr => (
          <Collection
            touched
            array
            key={attr.index}
            {...attrCollectionValidation}
          >
            <Input
              data-testid={attr.nameInput}
              type="text"
              {...attr.attrValidation}
            />
          </Collection>
        ))}
      </Collection>
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
      {statusCollection.error && (
        <label data-testid="errorLabelCollection">
          {statusCollection.error}
        </label>
      )}
    </div>
  );
}
