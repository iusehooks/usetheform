import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import {
  Collection,
  useAsyncValidation,
  useValidation,
  useSelector,
  PersistStateOnUnmount,
  Select,
  TextArea,
  useMultipleForm,
  STATUS
} from "@usetheform";
import { Reset } from "@site/src/components/helpers/Reset";
import { Submit } from "@site/src/components/helpers/Submit";
import { InputLabel as Input } from "@site/src/components/helpers/InputLabel";
import { CustomInput } from "@site/src/components/helpers/CustomInput";
import { FormContext, Form } from "@site/src/components/helpers/FormContext";
import { CounterSubmitAttempts } from "@site/src/components/helpers/CounterSubmitAttempts";
import { CounterReader } from "@site/src/components/helpers/CounterReader";
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
import { useColorMode } from "@docusaurus/theme-common";

// This will act as a wrapper to set the scope for React Live
const ReactLiveScopeWrapper = ({ children }) => {
  const { colorMode } = useColorMode(); // 'light' | 'dark'
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    Input,
    PersistStateOnUnmount,
    Collection,
    TextArea,
    Select,
    useAsyncValidation,
    useValidation,
    useSelector,
    useMultipleForm,
    STATUS,
    Reset,
    Submit,
    CustomInput,
    Item,
    reduceTotalPrice,
    reduceTotalQuantity,
    asyncTestForm,
    asyncTestInput,
    FormContext,
    Form,
    CounterSubmitAttempts,
    CounterReader
    // Add other React components or custom components you want to expose to live code
  };
  const theme = colorMode === "dark" ? themes.dracula : themes.github;

  return (
    <LiveProvider code={children} scope={scope} theme={theme}>
      <div className="playgroundContainer_BKND">
        <div className="playgroundHeader_BYID">Preview</div>
        <LivePreview
          data-colormode={colorMode}
          className="playgroundPreview_wiye"
        />
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
