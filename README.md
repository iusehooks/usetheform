# <p align="center"> <img src='https://iusehooks.github.io/usetheform/docs/gatsby-theme-docz/assets/logo.png' width="233" height='51' alt='Usetheform Logo' /> </p>

<h3 align="center">An easy way for building forms in React.</h3><br/>

<p align="center">
<a href="https://travis-ci.org/iusehooks/usetheform"><img src="https://travis-ci.org/iusehooks/usetheform.svg?branch=master" alt="Build info" height="20"/></a>
<a href="https://bundlephobia.com/result?p=usetheform@latest"><img src="https://img.shields.io/bundlephobia/minzip/usetheform.svg" alt="Bundle size" height="20"/></a>
<a href="https://twitter.com/intent/tweet?text=React%20library%20for%20composing%20declarative%20forms%2C%20manage%20their%20state%2C%20handling%20their%20validation%20and%20much%20more&url=https://github.com/iusehooks/usetheform&hashtags=reactjs,webdev,javascript,forms,reacthooks"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social" alt="Tweet" height="20"/></a>
</p><br/><br/>


<div align="center">
    <p align="center">
        <a href="https://iusehooks.github.io/usetheform/" title="Usetheform">
            <img src="https://raw.githubusercontent.com/iusehooks/usetheform/master/examples/img/example.gif" alt="React library for composing declarative forms and managing their state" width="800" />
        </a>
    </p>
</div><br/>

## :bulb: What is usetheform about?

Usetheform is a React library for composing declarative forms and managing their state. It uses the Context API and React Hooks. I does not depend on any library like redux or others.

- [Documentation](https://iusehooks.github.io/usetheform/)
- [Installation](#Installation)
- [Code Sandboxes Examples](#code-sandboxes)
- [License](#license)

✅ Zero dependencies 

✅ Only peer dependencies: React >= 16.8.0

## Installation

```sh
npm install --save usetheform
```

## :zap: Quickstart

```jsx
import React from "react";
import Form, { Input, useValidation } from "usetheform";

export default function App() {
  const onChange = (formState) => console.log("ON_CHANGE : ", formState);
  const onSubmit = (formState) => console.log("ON_SUBMIT : ", formState);

  const preventNegativeNumber = (next, prev) => (next <= 0 ? 0 : next);
  const required = (value) =>
    value && value.trim() !== "" ? undefined : "Required";

  const [status, validation] = useValidation([required]);

  return (
    <Form onSubmit={onSubmit} onChange={onChange}>
      <Input name="firstname" type="text" touched {...validation} />
      {status.error && <span>{status.error}</span>}
      <Input name="lastname" type="text" />
      <Input name="age" type="number" value={18} reducers={preventNegativeNumber} />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Code Sandboxes

- Shopping Cart: [Sandbox](https://codesandbox.io/s/shopping-cart-97y5k)
- Examples: Slider, Select, Collections etc..: [Sandbox](https://codesandbox.io/s/formexample2-mmcjs)
- Various Implementation: [Sandbox](https://codesandbox.io/s/035l4l75ln)
- Wizard: [Sandbox](https://codesandbox.io/s/v680xok7k7)
- FormContext: [Sandbox](https://codesandbox.io/s/formcontext-ukvc5)
- Material UI - React Select: [Sandbox](https://codesandbox.io/s/materialuireactselect-6ufc2) 

## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
