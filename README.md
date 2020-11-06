# <img src='https://iusehooks.github.io/usetheform/docs/gatsby-theme-docz/assets/logo.png' width="233" height='51' alt='Usetheform Logo' />

Usetheform is a React library for composing declarative forms and managing their state. It uses the Context API and React Hooks. I does not depend on any library like redux or others.

<div align="center">
    <p align="center">
        <a href="https://iusehooks.github.io/usetheform/" title="Usetheform">
            <img src="https://raw.githubusercontent.com/iusehooks/usetheform/master/examples/img/example.gif" alt="React library for composing declarative forms and managing their state" width="800" />
        </a>
    </p>
</div>

- [Documentation](https://iusehooks.github.io/usetheform/)
- [Installation](#Installation)
- [CodeSandbox Examples](#codesandbox-examples)
- [License](#license)

[![Build Status](https://travis-ci.org/iusehooks/usetheform.svg?branch=master)](https://travis-ci.org/iusehooks/usetheform) [![Package size](https://img.shields.io/bundlephobia/minzip/usetheform.svg)](https://bundlephobia.com/result?p=usetheform) ![License](https://img.shields.io/npm/l/usetheform.svg?style=flat) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=React%20library%20for%20composing%20declarative%20forms%2C%20manage%20their%20state%2C%20handling%20their%20validation%20and%20much%20more&url=https://github.com/iusehooks/usetheform&hashtags=reactjs,webdev,javascript,forms,reacthooks)

✅ Zero dependencies 

✅ Only peer dependencies: React >= 16.8.0

# Installation

```sh
npm install --save usetheform
```

# Quickstart

```jsx
import React from "react";
import Form, { Input, useValidation } from "usetheform";

export default function App() {
  const onChange = (formState) => console.log("ON_CHANGE : ", formState);
  const onSubmit = (formState) => console.log("ON_SUBMIT : ", formState);

  const reduceAge = (next, prev) => (next <= 0 ? 0 : next);
  const required = (value) =>
    value && value.trim() !== "" ? undefined : "Required";

  const [status, validation] = useValidation([required]);

  return (
    <Form onSubmit={onSubmit} onChange={onChange}>
      <Input name="firstname" type="text" touched {...validation} />
      {status.error && <span>{status.error}</span>}
      <Input name="lastname" type="text" />
      <Input name="age" type="number" value={18} reducers={reduceAge} />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

# CodeSandbox Examples

- Shopping Cart: [Sandbox](https://codesandbox.io/s/shopping-cart-97y5k)
- Examples: Slider, Select, Collections etc..: [Sandbox](https://codesandbox.io/s/formexample2-mmcjs)
- Various Implementation: [Sandbox](https://codesandbox.io/s/035l4l75ln)
- Wizard: [Sandbox](https://codesandbox.io/s/v680xok7k7)
- FormContext: [Sandbox](https://codesandbox.io/s/formcontext-ukvc5)
- Material UI - React Select: [Sandbox](https://codesandbox.io/s/materialuireactselect-6ufc2) 

# License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
