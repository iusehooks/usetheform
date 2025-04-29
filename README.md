<p align="center">
  <img src="https://raw.githubusercontent.com/iusehooks/usetheform/refs/heads/master/workspaces/docs/static/img/logo.png" width="233" height="51" alt="Usetheform Logo" />
</p>

<h3 align="center">An easy way to build forms in React.</h3>

<div align="center">

  [![Code Coverage](https://coveralls.io/repos/github/iusehooks/usetheform/badge.svg?branch=master)](https://coveralls.io/github/iusehooks/usetheform?branch=master)
  [![Usetheform CI](https://github.com/iusehooks/usetheform/actions/workflows/github-actions.yml/badge.svg?branch=master)](https://github.com/iusehooks/usetheform/actions/workflows/github-actions.yml)
  [![Bundle Size](https://img.shields.io/bundlephobia/minzip/usetheform.svg)](https://bundlephobia.com/result?p=usetheform@latest)
  [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=React%20library%20for%20composing%20declarative%20forms%2C%20manage%20their%20state%2C%20handling%20their%20validation%20and%20much%20more&url=https://github.com/iusehooks/usetheform&hashtags=reactjs,webdev,javascript,forms,reacthooks)

</div>

<br/>

<p align="center">
  <a href="https://iusehooks.github.io/usetheform/" title="Usetheform Docs">
    <img src="https://raw.githubusercontent.com/iusehooks/usetheform/master/examples/img/example.gif" alt="Demo GIF" width="800" />
  </a>
</p>

## 💡 What is Usetheform?

**Usetheform** is a lightweight, dependency-free React library for composing **declarative forms** and managing their state. It's simple to use, flexible, and powerful for handling nested fields, validation, and much more.

📚 [Documentation](https://iusehooks.github.io/usetheform/)<br/>
⚡ [Quickstart](#zap-quickstart)<br/>
🔥 [Features](#fire-features)<br/>
📖 [Recipes](#book-recipes)<br/>
🧠 [Motivation](#brain-motivation)<br/>
🧪 [Code Sandboxes](#code-sandboxes)<br/>
🤝 [How to Contribute](#how-to-contribute)<br/>
📄 [License](#license)


## :fire: Features

- 📦 Easy integration with libraries like [React Select/Material UI](https://codesandbox.io/s/materialuireactselect-6ufc2) and [React Dropzone/Material UI Dropzone](https://codesandbox.io/s/reactdropzone-materialuidropzone-yjb8w)
- ✅ Sync and Async validation at:
  - [Form level](https://iusehooks.github.io/usetheform/components/Form#validatisync)
  - [Field level](https://iusehooks.github.io/usetheform/components/Input#validatisync)
  - [Collection level](https://iusehooks.github.io/usetheform/components/Collection#validatisync)
- 🔍 Schema validation with:
  - [Yup](https://codesandbox.io/p/sandbox/schema-validations-uc1m6?file=%2Fsrc%2FFormYUP.jsx)
  - [Zod](https://codesandbox.io/p/sandbox/schema-validations-uc1m6?file=%2Fsrc%2FFormZOD.jsx)
  - [Superstruct](https://codesandbox.io/p/sandbox/schema-validations-uc1m6?file=%2Fsrc%2FFormSuperStruct.jsx)
  - [Joi](https://codesandbox.io/p/sandbox/schema-validations-uc1m6?file=%2Fsrc%2FFormJOI.jsx)
- 🧬 Follows native HTML standards — [see in action](https://codesandbox.io/s/built-informvalidation-lp672?file=/src/Info.jsx)
- 🧠 Reducer support at:
  - [Form level](https://iusehooks.github.io/usetheform/components/Form/#reducers)
  - [Field level](https://iusehooks.github.io/usetheform/components/Input#reducers)
  - [Collection level](https://iusehooks.github.io/usetheform/components/Collection#reducers)
- 🧩 Easy handling of arrays, objects, and nested structures
  - [Nested collections demo](https://iusehooks.github.io/usetheform/components/Collection#nested-collections)
- 📦 Tiny bundle size, zero dependencies — [Check it on Bundlephobia](https://bundlephobia.com/result?p=usetheform)

## :zap: Quickstart

Install `usetheform` using your preferred package manager:

```bash
npm install --save usetheform
```

```bash
yarn add usetheform
```

#### Basic usage example:

```tsx
import React from "react";
import { Form, Input, useValidation } from "usetheform";
import { ReducerFn, ValidatorFn, OnChangeFormFn, OnSubmitFormFn } from "usetheform/types";

interface MyFormState {
  firstname: string;
  lastname: string;
  age: number;
}

const preventNegativeNumber: ReducerFn<MyFormState["age"]> = (next) =>
  next <= 0 ? 0 : next;
const required: ValidatorFn<MyFormState["firstname"]> = (value) =>
  value?.trim() ? undefined : "Required";

export default function App() {
  const onChange: OnChangeFormFn<MyFormState> = (formState) => console.log("ON_CHANGE:", formState);
  const onSubmit: OnSubmitFormFn<MyFormState> = (formState) => console.log("ON_SUBMIT:", formState);
  const [status, validation] = useValidation([required]);

  return (
    <Form<MyFormState> onSubmit={onSubmit} onChange={onChange}>
      <Input name="firstname" type="text" touched {...validation} />
      {status.error && <span>{status.error}</span>}
      <Input name="lastname" type="text" />
      <Input name="age" type="number" value={18} reducers={preventNegativeNumber} />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## :book: Recipes

### Accessing form fields outside the Form context

#### 🧱 Step 1: Create a form store

```tsx
interface FormState { counter: number; }
```

```tsx
import { createFormStore } from 'usetheform';

const [formStore, useFormSelector] = createFormStore<FormState>({ counter: 0 });

export const awesomeFormStore = formStore;
export const useAwesomeFormSelector = useFormSelector;
```

#### 🧩 Step 2: Create your awesome form

```tsx
import { Form, Input } from 'usetheform';
import { awesomeFormStore } from './awesomeFormStore';


export default function AwesomeForm() {
  return (
    <>
      <Form<FormState> formStore={awesomeFormStore}>
        <Input type="number" name="counter" value="0" placeholder="Counter" />
      </Form>
      <Counter />
    </>
  );
}
```

#### 🔌 Step 3: Connect your components

```tsx
import { useAwesomeFormSelector } from './awesomeFormStore';

export const Counter = () => {
  const [counter, setCounterValue] = useAwesomeFormSelector<"counter">((state) => state.counter);
  return (
    <div>
      <span>{counter}</span>
      <button onClick={() => setCounterValue(prev => ++prev)}>Increase</button>
      <button onClick={() => setCounterValue(prev => --prev)}>Decrease</button>
      <button onClick={() => setCounterValue(0)}>Reset</button>
    </div>
  );
};
```

## :brain: Motivation

**Usetheform** was created to provide a highly flexible, declarative way to handle forms in React with no dependencies. It supports:

- Nested field structures
- Synchronous & asynchronous validation
- Custom input and reducer logic
- Schema-based validation
- Tiny footprint

If you find this library useful, please ⭐ the repo. It means a lot! 🙏

## 👤 Author

- **Antonio Pangallo** — [@antonio_pangall](https://twitter.com/antonio_pangall)

### ⭐ Stargazers

[![Stargazers repo roster](https://reporoster.com/stars/iusehooks/usetheform)](https://github.com/iusehooks/usetheform/stargazers)

## Code Sandboxes

- [Twitter-style Form Bar](https://codesandbox.io/s/twitter-bar-form-czx3o)
- [Shopping Cart](https://codesandbox.io/s/shopping-cart-97y5k)
- [Form Examples (Select, Slider, Collections)](https://codesandbox.io/s/formexample2-mmcjs)
- [Various Implementations](https://codesandbox.io/s/035l4l75ln)
- [Wizard](https://codesandbox.io/s/v680xok7k7)
- [FormContext](https://codesandbox.io/s/formcontext-ukvc5)
- [Material UI + React Select](https://codesandbox.io/s/materialuireactselect-6ufc2)
- [Validation (Yup, Zod, Joi, Superstruct)](https://codesandbox.io/s/schema-validations-uc1m6)
- [React Dropzone + Material UI](https://codesandbox.io/s/reactdropzone-materialuidropzone-yjb8w)

## How to Contribute

🎉 Thanks for considering contributing!
Please read our [CONTRIBUTING.md](https://github.com/iusehooks/usetheform/blob/master/CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE.md) file for details.