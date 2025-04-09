import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Collection, useAsyncValidation, useValidation } from "@usetheform";
import { Reset } from "@site/src/components/helpers/Reset";
import { Submit } from "@site/src/components/helpers/Submit";
import { Form } from "@site/src/components/helpers/Form";
import { InputLabel as Input } from "@site/src/components/helpers/InputLabel";
import { CustomInput } from "@site/src/components/helpers/CustomInput";
import {
  Item,
  reduceTotalPrice,
  reduceTotalQuantity
} from "@site/src/components/helpers/Item";
import {
  asyncTestForm,
  asyncTestInput
} from "@site/src/components/helpers/utils";
import { themes } from "prism-react-renderer";

// This will act as a wrapper to set the scope for React Live
const ReactLiveScopeWrapper = ({ children }) => {
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    Form,
    Input: Input,
    Collection,
    Reset,
    Submit,
    CustomInput,
    useAsyncValidation,
    useValidation,
    Item,
    reduceTotalPrice,
    reduceTotalQuantity,
    asyncTestForm,
    asyncTestInput
    // Add other React components or custom components you want to expose to live code
  };

  return (
    <LiveProvider code={children} scope={scope} theme={themes.github}>
      <div className="playgroundContainer_BKND">
        <div className="playgroundHeader_BYID">Preview</div>
        <LivePreview className="playgroundPreview_wiye" />
        <div className="playgroundHeader_BYID">Live Editor</div>
        <div className="playgroundEditor_yR0i">
          <LiveEditor className="prism-code language-tsx" />
        </div>
        <LiveError />
      </div>
    </LiveProvider>
  );
};

export default ReactLiveScopeWrapper;
