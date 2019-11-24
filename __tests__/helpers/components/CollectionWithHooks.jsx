import React from "react";
import { useCollection } from "./../../../src";

export default function CollectionWithHooks({ value, type = "object" }) {
  const { updateCollection } = useCollection({
    name: "hook",
    type,
    value
  });

  const onUpdateCollection = () => updateCollection("name", "foo");

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
