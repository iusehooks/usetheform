# UseTheForm

UseTheForm is a React library for composing declarative forms in React and manage their state. It uses the Context API and React Hooks. I does not depend on any libray like redux or others. It is still an alpha version.

- [Basic Example](#basic-example)
- [Apply Sync Validation](#apply-sync-validation)
- [Apply Async Validation](#apply-async-validation)
- [Apply Reducers](#apply-reducers)
- [Use Multiple Form - Wizard](#use-multiple-form---wizard)
- [UseTheForm API Reference](#usetheform-api-reference)
- [CodeSandbox Examples](#codesandbox-examples)
- [License](#license)

[![Package size](https://img.shields.io/bundlephobia/minzip/usetheform.svg)](https://bundlephobia.com/result?p=usetheform) ![License](https://img.shields.io/npm/l/usetheform.svg?style=flat) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=React%20library%20for%20composing%20declarative%20forms%2C%20manage%20their%20state%2C%20handling%20their%20validation%20and%20much%20more&url=https://github.com/iusehooks/usetheform&hashtags=reactjs,webdev,javascript,forms,reacthooks)

✅ Zero dependencies 

✅ Only peer dependencies: React >= 16.8.0

# Installation

```sh
npm install --save usetheform
```

# Basic Example

UseTheForm allows to declarative defining our form output, managing its state, handling its validation and much more.

## Let's see how it works.

The form below contains two `Collections`, one of type object and one of type array. Each `Collection` is composed by two input Fields of type text `<Input type="text" />`.
For all the supported input fields type you can check at: [W3schools Input Types](https://www.w3schools.com/html/html_form_input_types.asp)

```js
import React from "react";
import Form, { Input, Collection } from "usetheform";

const App = () => (
  <Form
    onChange={state => console.log(state)}
    onSubmit={state => console.log(state)}
  >
    <Collection object name="user">
      <Input type="text" name="name" />
      <Input type="text" name="lastname" />
    </Collection>
    <Collection array name="addresses">
      <Input type="text" placeholder="Type Address 1..." />
      <Input type="text" placeholder="Type Address 2..." />
    </Collection>
    <button type="submit">Submit</button>
  </Form>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

The Form above will provide the following output:

```js
const output = {
  user: {
    name: "Anything you typed",
    lastname: "Anything you typed"
  },
  addresses: ["Any Address you typed", "Any Address you typed"]
};
```

# Apply Sync Validation

UseTheForm provides a specific hook called `useValidation([func1, func1N])` which allows to apply synchronous validation either at Field level or at Collection level.

## Sync Validation at Field level

```js
import React from "react";
import { Input, useValidation } from "usetheform";

const minLength = value =>
  value === "" || value.length > 4 ? undefined : "Length error";
const required = value => (value !== "" ? undefined : "Required");

const InputSyncValidation = ({ name }) => {
  const [status, validationAttr] = useValidation([minLength, required]);
  return (
    <div>
      <Input touched name={name} type="text" {...validationAttr} />
      {status.error && <label>{status.error}</label>}
    </div>
  );
};

export default InputSyncValidation;
```

## Sync Validation at Collection level

```js
import React from "react";
import { Input, Collection, useValidation } from "usetheform";

const allFieldsFilledOut = userState =>
  userState !== undefined &&
  Object.keys(userState).every(key => userState[key] && userState[key] !== "")
    ? undefined
    : "Fill out all the fields";

export default function CollectionSyncValidation() {
  const [status, validationAttr] = useValidation([allFieldsFilledOut]);

  return (
    <div>
      <Collection object name="user1" {...validationAttr}>
        <Input type="text" name="name" />
        <Input type="text" name="lastname" />
      </Collection>
      {status.error && <label>{status.error}</label>}
    </div>
  );
}
```

## Compose the Form

```js
import React from "react";
import Form, { Input, Collection } from "usetheform";
import InputSyncValidation from "./components/InputSyncValidation";
import CollectionSyncValidation from "./components/CollectionSyncValidation";

const App = () => (
  <Form
    onChange={state => console.log(state)}
    onSubmit={state => console.log(state)}
  >
    <CollectionSyncValidation />
    <InputSyncValidation name="anyname" />
    <button type="submit">Submit</button>
  </Form>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

# Apply Async Validation

UseTheForm provides a specific hook called `useAsyncValidation(func)` which allows to apply asynchronous validation either at Field level or at Collection level.

```js
import React from "react";
import { Input, useAsyncValidation } from "usetheform";

const asyncTest = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value !== "ciao") {
        reject("Error username taken");
      } else resolve();
    }, 3000);
  });

const InputAsyncValidation = ({ name }) => {
  const [asyncStatus, validationAttr] = useAsyncValidation(asyncTest);
  return (
    <div>
      {asyncStatus.status === "asyncStart" && <label>Fetching...</label>}
      <Input touched name={name} type="text" {...validationAttr} />
      {asyncStatus.status === "asyncError" && (
        <label>{asyncStatus.value}</label>
      )}
    </div>
  );
};

export default InputAsyncValidation;
```

# Apply Reducers

UseTheForm allows to write pure reducer functions to reduce the form state at different levels. It supports reducer functions at Fields, Collection and Form level. It is allowed to have either multiple or single reducer functions at each level.

### Reducer Function

```js
const reducer = (nextValue, prevValue, formState) =>
  nextValue !== undefined ? nextValue + 1 : nextValue;
```

Any reducer function receives three arguments: the next value, the previous value and entire form state and it must return the new value.

If multiple reducer functions are passed, they will be chained in sequence based on their order. The first function of the chain will receive the `nextValue` and whatever value it will return it will be passed as `nextValue` of the second function of the chain and so on.

## Reducers at Field level

```js
import React from "react";
import Form, { Input } from "usetheform";

const maxLength = max => (nextValue, prevValue, formState) =>
  nextValue && nextValue.length > max ? prevValue : nextValue;

const noNumber = (nextValue, prevValue, formState) =>
  nextValue && /\d/.test(nextValue) ? prevValue : nextValue;

const App = () => (
  <Form
    onChange={state => console.log(state)}
    onSubmit={state => console.log(state)}
  >
    <Input type="text" name="anyname" reducers={[maxLength(3), noNumber]} />
    <button type="submit">Submit</button>
  </Form>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

## Reducers at Collection level

```js
import React from "react";
import Form, { Input, Collection } from "usetheform";

const maxLength = (max, prop) => (nextValue, prevValue, formState) =>
  nextValue && nextValue[prop] && nextValue[prop].length > max
    ? prevValue
    : nextValue;

const App = () => (
  <Form
    onChange={state => console.log(state)}
    onSubmit={state => console.log(state)}
  >
    <Collection
      object
      name="user"
      reducers={[maxLength(5, "name"), maxLength(7, "lastname")]}
    >
      <Input type="text" name="name" />
      <Input type="text" name="lastname" />
    </Collection>
    <button type="submit">Submit</button>
  </Form>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

## Reducers at Form level

```js
import React from "react";
import Form, { Input } from "usetheform";

const maxLength = (max, prop) => (nextValue, prevValue, formState) =>
  nextValue && nextValue[prop] && nextValue[prop].length > max
    ? prevValue
    : nextValue;

const App = () => (
  <Form
    reducers={[maxLength(5, "name"), maxLength(7, "lastname")]}
    onChange={state => console.log(state)}
    onSubmit={state => console.log(state)}
  >
    <Input type="text" name="name" />
    <Input type="text" name="lastname" />
    <button type="submit">Submit</button>
  </Form>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

# Use Multiple Form - Wizard

One common form implementation is to handle multiple form states and submitting the merged output of their states. This implementation is commonly known as Wizard.

## Wizard Implementation
Each Form must have a unique `name` prop and using the `useMultipleForm()` api.

```js
import React, { useState, Fragment } from "react";
import Form, { Input, useMultipleForm } from "usetheform";

const Wizard = () => {
  const [state, setState] = useState({ page: 1 });
  const nextPage = () => setState({ page: state.page + 1 });
  const prevPage = () => setState({ page: state.page - 1 });

  const [getWizardState, wizardApi] = useMultipleForm();
  return (
    <Fragment>
      {state.page === 1 && (
        <Form name="form1" {...wizardApi} onSubmit={nextPage}>
          <Input type="text" name="name" />
          <Input type="text" name="lastname" />
          <button type="submit">Next</button>
        </Form>
      )}
      {state.page === 2 && (
        <Form
          name="form2"
          onSubmit={() => console.log(getWizardState())}
          {...wizardApi}
        >
          <Input type="text" name="country" />
          <Input type="text" name="city" />
          <button type="button" onClick={prevPage}>
            Previous
          </button>
          <button type="submit">Submit Wizard</button>
        </Form>
      )}
    </Fragment>
  );
};

export default Wizard;
```

# UseTheForm API Reference

- [Form](#form)
- [useForm](#useform)
- [Fields](#fields)
  - [Input](#input)
  - [Select](#select)
  - [TextArea](#textarea)
  - [Collection](#collection)
- [useValidation](#usevalidation)
- [useAsyncValidation](#useasyncvalidation)
- [useMultipleForm](#usemultipleform)

## Form

The Form is the most important component in UseTheForm. It renders all the Fields and keeps synchronized the entire form state.

### Props

`onInit`
A function invoked when the Form is initialized.

```js
<Form onInit={state => console.log(state)}>
  <Input type="text" name="anyname" />
</Form>
```

`onChange`
A function invoked when any Form Field change its value.

```js
<Form onChange={state => console.log(state)}>
  <Input type="text" name="anyname" />
</Form>
```

`onReset`
A function invoked when the form has been reset to its initial State.

```js
<Form onReset={state => console.log(state)}>
  <Input type="text" name="anyname" />
</Form>
```

`onSubmit`
A function invoked when the form has been submitted.

```js
<Form onSubmit={state => console.log(state)}>
  <Input type="text" name="anyname" />
</Form>
```

**Warning:** `onSubmit` will be only invoked if your form passes all the validations added at any level (Collections or Fields).

`initialState`
It is a plain object that rappresent the initial state of the form.

```js
const initialState = {
  anyname: "test"
}
<Form initialState={initialState}>
  <Input type="text" name="anyname" />
</Form>
```

`reducers`
It can be either an array of function reducers or a single function reducer.
It receives three arguments: the next value, the prev value and the entire form state.

```js
const maxLength = (nextValue, prevValue, formState) =>
  nextValue && nextValue.anyname && nextValue.anyname.length > 10
    ? prevValue
    : nextValue;

<Form reducers={maxLength}>
  <Input type="text" name="anyname" />
</Form>;
```

## useForm

It is a custom hook function which provides:

- `state` an object which is the form state.
- `reset` a function which can reset the entire form state to the its initial state.
- `isValid` a boolean indicating whether the form is valid or not.
- `pristine` a boolean indicating whether the form has been at least changed once.
- `formStatus` a string indicating the form status. It can be one of: "ON_CHANGE", "ON_SUBMIT", "ON_RESET", "ON_INIT".

> **Tip**: status can be imported => import { STATUS } from "usetheform".

```js
const { state, reset, isValid, pristine, formStatus } = useForm();
```

### useForm - Usage Examples

```js
import React from "react";
import { useForm } from "usetheform";

const Reset = props => {
  const { reset, pristine } = useForm();
  return (
    <button disabled={pristine} type="button" onClick={reset}>
      Reset
    </button>
  );
};

export default Reset;
```

```js
import React from "react";
import { useForm } from "./useform";

export default function Sumbit() {
  const { state, isValid } = useForm();
  const enabled = isValid && Object.keys(state).length > 0;
  return (
    <button disabled={enabled} type="submit">
      Submit
    </button>
  );
}
```

## Fields

It is not a React Component. Any Component considered as Field shares the following props.

### Props

`reducers`
It can be either an array of function reducers or a single function reducer.
It receives three arguments: the next value, the prev value and the entire form state.

`name`
A String to uniquely identify the Field within its context.
The **context** of any Field can be either the `<Form >` or any `<Collection >` of any type (array or object).

`value`
A String which assigns the initial value of the Field.

`touched`
It is a boolean. If it is true it shows validation errors once your field has been touched.

Following are listed all the supported Fields.

**Warning:** `value` and `touched` it is not supported for `<Collection />`.

## Input

The `<Input />` is a Field component which renders all the inputs of type listed at: [W3schools Input Types](https://www.w3schools.com/html/html_form_input_types.asp) and it accepts as props any html attribute listed at: [Html Input Attributes](https://www.w3schools.com/tags/tag_input.asp)

```js
<Form>
  <Input type="text" name="anyname1" />
  <Input type="number" name="anyname2" />
  <Input type="password" name="anyname3" />
  <Input type="checkbox" name="anyname4" />
  <Input type="radio" name="anyname5" />
  <Input type="file" name="anyname5" />
</Form>
```

### Input - Props

`type`
A String to assing a type to the input. Type listed at: [W3schools Input Types](https://www.w3schools.com/html/html_form_input_types.asp)

```js
<Form>
  <Input type="text" name="anyname1" value="test" />
  <Input type="number" name="anyname2" value="123" />
</Form>
```

**Warning:** `value` it is not supported for `<Input type="file" />`.

## Select

The `<Select />` is a Field component which renders a drop-down list. It accepts as props any html attribute listed at: [Html Select Attributes](https://www.w3schools.com/tags/tag_select.asp)

```js
<Form>
  <Select name="anyname" value="123">
    <option value="" />
    <option value="123">123</option>
    <option value="456">456</option>
  </Select>
</Form>
```

## TextArea

The `<TextArea />` is a Field component which defines a multi-line text input control. It accepts as props any html attribute listed at: [Html TextArea Attributes](https://www.w3schools.com/tags/tag_textarea.asp)

```js
<Form>
  <TextArea name="anyname" value="123" />
</Form>
```

## Collection

`<Collection />` allows to created nested piece of state within a `<Form />`.
It creates either a Collection of type object or array.

### Collection - Props

`object`
A boolean. It creates a `<Collection object />` of context type object.

```js
<Form>
  <Collection object name="parent">
    <Input type="text" name="child1" />
    <Input type="text" name="child2" />
  </Collection>
</Form>
```

`array`
A boolean. It creates a `<Collection array />` of context type array.

```js
<Form>
  <Collection array name="parent">
    <Input type="text" />
    <Input type="text" />
  </Collection>
</Form>
```

## useValidation

It is a custom hook function which provides the validation logic to any Field.
It receives an array as argument which contains all the validation functions.

A validation function is a pure function which receives the field value and checks if wheater the value is valid or not, returning `undefined or null` if it is valid or a string with some custom message if it is not valid.

```js
const required = value => (value && value !== "" ? undefined : "Required");
const [status, validationAttr] = useValidation([required]);
<div>
  <Input type="text" name="anyname" touched {...validationAttr} />
  {status.error && <label>{status.error}</label>}
</div>;
```

## useAsyncValidation

It is a custom hook function which provides the async validation logic to any Field.
It receives an array as argument a function which returns a Promise which is resolved if it passes the validation rejected otherwise.

It returns an array with two items.

```js
const [asyncStatus, validationAttr] = useAsyncValidation(func);
```

The first item is a plain object which contains two props: `status` and `value`.
`status` it is a string which can be of the following value:

- "asyncStart": when the async fucntion start.
- "asyncSuccess": when the async fucntion complete with success.
- "asyncError: when the async fucntion complete with error.

The second item is a plain object which contains all the props that must be spreaded to the Field.

```js
const asyncTest = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value !== "ciao") {
        reject("Error username taken");
      } else resolve();
    }, 3000);
  });
const [asyncStatus, validationAttr] = useAsyncValidation(asyncTest);
<div>
  <Input type="text" name="anyname" touched {...validationAttr} />
  {asyncStatus.status === "asyncError" && <label>{asyncStatus.value}</label>}
</div>;
```

## useMultipleForm
It is a custom hook function which provides the logic to handle the implementation of wizards.

```js
const [getWizardStatus, wizardApi] = useMultipleForm(callback);
```

`getWizardStatus` - It is a function that returns the actual state of the wizard.

`wizardApi` - An object of props that must be spreaded in each form.

```js
const [getWizardStatus, wizardApi] = useMultipleForm();
<Form {...wizardApi} name="form1" />
<Form {...wizardApi} name="form2" />
```

`callback` - A function that is called anytime one of the form updates its state.

```js
const [getWizardStatus, wizardApi] = useMultipleForm(state => console.log(state));
```


# CodeSandbox Examples

- UseTheForm: [Sandbox](https://codesandbox.io/s/035l4l75ln)

# License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
