# <p align="center"> <img src='https://iusehooks.github.io/usetheform/docs/gatsby-theme-docz/assets/logo.png' width="233" height='51' alt='Usetheform Logo' /> </p>

<h3 align="center">An easy way for building forms in React.</h3><br/>

<p align="center">
<a href="https://coveralls.io/github/iusehooks/usetheform?branch=master"><img src="https://coveralls.io/repos/github/iusehooks/usetheform/badge.svg?branch=master" alt="Code Coverage" height="20"/></a>
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

Welcome! 👋 Usetheform is a React library for composing declarative forms and managing their state. It does not depend on any external library like Redux, MobX or others, which makes it to be easily adoptedable without other dependencies.

- [Documentation](https://iusehooks.github.io/usetheform/)
- [Features](#fire-features)
- [Quickstart](#zap-quickstart)
- [Motivation](#motivation)
- [Code Sandboxes Examples](#code-sandboxes)
- [Contributing](#contributing)
- [License](#license)

## :fire: Features

- Easy integration with other libraries. 👉🏻 [Play with React Select/Material UI](https://codesandbox.io/s/materialuireactselect-6ufc2) - [React Dropzone/MaterialUI Dropzone](https://codesandbox.io/s/reactdropzone-materialuidropzone-yjb8w).
- Support Sync and Async validation at [Form](https://iusehooks.github.io/usetheform/docs-form#validation---sync), [Field](https://iusehooks.github.io/usetheform/docs-input#validation---sync) and [Collection](https://iusehooks.github.io/usetheform/docs-collection#validation---sync) level. 👉🏻 [Play with Sync and Async validation](https://iusehooks.github.io/usetheform/docs-input#validation---sync).
- Support [Yup](https://codesandbox.io/s/schema-validations-uc1m6?file=/src/FormYUP.jsx), [Zod](https://codesandbox.io/s/schema-validations-uc1m6?file=/src/FormZOD.jsx), [Superstruct](https://codesandbox.io/s/schema-validations-uc1m6?file=/src/FormSuperStruct.jsx), [Joi](https://codesandbox.io/s/schema-validations-uc1m6?file=/src/FormJOI.jsx) or custom. 👉🏻 [Play with YUP - ZOD - Superstruct - Joi validations](https://codesandbox.io/s/schema-validations-uc1m6).
- Follows HTML standard for validation. 👉🏻 [Play with HTML built-in form validation](https://codesandbox.io/s/built-informvalidation-lp672?file=/src/Info.jsx).
- Support reducers functions at [Form](https://iusehooks.github.io/usetheform/docs-form#reducers), [Field](https://iusehooks.github.io/usetheform/docs-input#reducers) and [Collection](https://iusehooks.github.io/usetheform/docs-collection#reducers) level. 👉🏻 [Play with Reducers](https://iusehooks.github.io/usetheform/docs-form#reducers).
- Easy to handle arrays, objects or nested collections. 👉🏻 [Play with nested collections](https://iusehooks.github.io/usetheform/docs-collection#nested-collections).
- Tiny size with zero dependencies. 👉🏻 [Check size](https://bundlephobia.com/result?p=usetheform).
- Typescript supported.

## :zap: Quickstart

```sh
npm install --save usetheform
```

```jsx
import React from "react";
import Form, { Input, useValidation } from "usetheform";

const preventNegativeNumber = (next, prev) => (next <= 0 ? 0 : next);
const required = (value) =>
    value && value.trim() !== "" ? undefined : "Required";

export default function App() {
  const onChange = (formState) => console.log("ON_CHANGE : ", formState);
  const onSubmit = (formState) => console.log("ON_SUBMIT : ", formState);

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

## Motivation

**usetheform** has been built having in mind the necessity of developing a lightweight library able to provide an easy API to build complex forms composed by nested levels (arrays, objects, custom inputs, etc.) with a declarative approach and without the need to include external libraries within your react projects.  

It's easy to start using it in your existing project and gives you a full controll over Field, Collection at any level of nesting which makes easy to manipulate the form state based on your needs. Synchronous and asynchronous validations are simple and error messages easy to customize and display. If you find it useful please leave a star 🙏🏻.

## Author

- Antonio Pangallo [@antonio_pangall](https://twitter.com/antonio_pangall)

## Code Sandboxes

- Twitter What's Happening Form Bar: [Sandbox](https://codesandbox.io/s/twitter-bar-form-czx3o)
- Shopping Cart: [Sandbox](https://codesandbox.io/s/shopping-cart-97y5k)
- Examples: Slider, Select, Collections etc..: [Sandbox](https://codesandbox.io/s/formexample2-mmcjs)
- Validation using Yup, ZOD, JOI, Superstruct: [Sandbox](https://codesandbox.io/s/schema-validations-uc1m6)
- Wizard: [Sandbox](https://codesandbox.io/s/v680xok7k7)
- FormContext: [Sandbox](https://codesandbox.io/s/formcontext-ukvc5)
- Material UI - React Select: [Sandbox](https://codesandbox.io/s/materialuireactselect-6ufc2)
- React Dropzone - Material UI Dropzone: [Sandbox](https://codesandbox.io/s/reactdropzone-materialuidropzone-yjb8w)
- Various Implementation: [Sandbox](https://codesandbox.io/s/035l4l75ln)

## Contributing

🎉 First off, thanks for taking the time to contribute! 🎉

We would like to encourage everyone to help and support this library by contributing. See the [CONTRIBUTING file](https://github.com/iusehooks/usetheform/blob/master/CONTRIBUTING.md).

## License

This software is free to use under the MIT license.
See the [LICENSE file](/LICENSE.md) for license text and copyright information.
