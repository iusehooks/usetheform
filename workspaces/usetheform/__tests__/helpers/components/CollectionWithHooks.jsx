import React from "react";
import { useCollection, withIndex } from "./../../../src";

export function CollectionWithHooks({
  value,
  type = "object",
  name,
  dataTestid = "changeCollection",
  propToChange
}) {
  const { updateCollection } = useCollection({
    name,
    type,
    value
  });

  const propName = propToChange || name;

  const onUpdateCollection = () => updateCollection(propName, "foo");

  return (
    <button type="button" data-testid={dataTestid} onClick={onUpdateCollection}>
      Update Collection
    </button>
  );
}

export default withIndex(CollectionWithHooks);
