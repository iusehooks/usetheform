import React, { useState } from "react";
import { useSelector } from "./../../../src";

export const CmpWithSelectorToggle = ({ id = "", ...props }) => {
  const [visible, toggle] = useState(() => true);

  return (
    <>
      {visible && <CmpWithSelector id={id} {...props} />}
      <button
        type="button"
        data-testid={`toggle${id}`}
        onClick={() => toggle(prev => !prev)}
      />
    </>
  );
};

export const CmpWithSelector = ({ selector, setNewValue, id = "" }) => {
  const [value = "", setValue] = useSelector(selector);

  const valueToShow = typeof value === "object" ? JSON.stringify(value) : value;
  return (
    <>
      <pre>
        <code data-testid={`selector${id}`}>{valueToShow}</code>
      </pre>
      <button
        type="button"
        data-testid={`selectorBtn${id}`}
        onClick={() => setValue(setNewValue)}
      />
    </>
  );
};
