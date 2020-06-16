import React from "react";
import { useCollection, withIndex } from "./../../../src";

export function CollectionWithHooks({
  value,
  type = "object",
  index,
  name,
  propToChange
}) {
  const { updateCollection } = useCollection({
    index,
    name,
    type,
    value
  });

  const propName = propToChange || name || index;

  const onUpdateCollection = () => updateCollection(propName, "foo");

  return (
    <button
      type="button"
      data-testid="changeCollection"
      onClick={onUpdateCollection}
    >
      Update Collection
    </button>
  );
}

export default withIndex(CollectionWithHooks);
