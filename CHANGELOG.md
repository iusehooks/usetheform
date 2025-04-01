# Changelog

## [v3.5.0](https://github.com/iusehooks/usetheform/releases/tag/v3.5.0)

### Improvements:

- Enhanced automation tests to support multiple React versions.

### Fixes:

- Fixed issues with React 18+ strict mode in certain edge cases when using the `<Collection array />`

## [v3.4.1](https://github.com/iusehooks/usetheform/releases/tag/v3.4.1)

### Improvements:

- In `usetheform`, if a Field gets unmounted, its value within the Form state gets cleared. You can now wrap your Field elements between the `<PersistStateOnUnmount />` component to preserve the Field's values.

**Example:**

```javascript
const Example = () => {
  const [visible, toggle] = useState(false);
  return (
    <Form>
      <PersistStateOnUnmount>
        {!visible && (
          <Collection object name="user">
            <Input type="text" name="name" value="abc" />
            <Input type="text" name="lastname" value="foo" />
          </Collection>
        )}
        <Input type="text" name="other" />
      </PersistStateOnUnmount>
      <button type="button" onClick={() => toggle((prev) => !prev)}>
        Toggle Collection
      </button>
    </Form>
  );
};
```

## [v3.4.0](https://github.com/iusehooks/usetheform/releases/tag/v3.4.0)

### Improvements:

- Enabling sync and async validation at form level.
- Improving documentation.

**Example:**

```javascript
const greaterThan10 = ({ values }) =>
  values && values["A"] + values["B"] > 10 ? undefined : "A+B must be > 10";

function App() {
  const [status, validation] = useValidation([greaterThan10]);
  return (
    <Form touched {...validation}>
      <Collection object name="values">
        <Input type="number" name="A" value="1" />
        <Input type="number" name="B" value="2" />
      </Collection>
      {status.error && <label>{status.error}</label>}
      <button type="submit">Press to see results</button>
    </Form>
  );
}
```

## [v3.3.1](https://github.com/iusehooks/usetheform/releases/tag/v3.3.1)

### Improvements:

- Typescript declaration file for supporting the use of `usetheform` within TypeScript projects.

**Example:**

```typescript
declare module "usetheform" {
  export const Form: any;
  export const Input: any;
  ...
}
```

## [v3.3.0](https://github.com/iusehooks/usetheform/releases/tag/v3.3.0)

### Improvements:

- `innerRef` prop can now be passed to `Form`, `Input`, `Select`, `TextArea`.
- `setValue` added to `useField({ type="custom" })`.

**Example:**

```javascript
const CustomField = ({ name }) => {
  const { value, setValue } = useField({ type: "custom", name, value: "5" });
  const onSetValue = () => setValue((prev) => ++prev);

  return (
    <pre>
      <code data-testid="output">{JSON.stringify(value)}</code>
      <button type="button" onClick={onSetValue}>
        Set Value
      </button>
    </pre>
  );
};

function App() {
  const formRef = useRef();
  const inputRef = useRef();

  return (
    <Form innerRef={formRef}>
      <Input innerRef={inputRef} type="text" name="user" value="BeBo" />
    </Form>
  );
}
```

## [v3.2.1](https://github.com/iusehooks/usetheform/releases/tag/v3.2.1)

### Improvements:

- Fixed initial value `undefined` issue when passed as a prop for `useField`, `Input`, `Select`, `Collection`, `TextArea`.

**Example:**

```javascript
const CustomField = ({ name }) => {
  const { value } = useField({ type: "text", name, value: "5" });

  // Now, value is defined since the first render => value = "5"
  // does not need to wait for the <Form /> to be READY

  return (
    <pre>
      <code data-testid="output">{JSON.stringify(value)}</code>
    </pre>
  );
};

function App() {
  return (
    <Form>
      <Input type="text" name="user" value="BeBo" />
      <CustomField name="other" />
    </Form>
  );
}
```

## [v3.2.0](https://github.com/iusehooks/usetheform/releases/tag/v3.2.0)

### Improvements:

- `useSelector`: `useSelector(selector: Function)` allows picking a single "Field" from the Form state using a selector function.
- Updated documentation.
- Some code refactoring.

**Example:**

```javascript
function Counter() {
  const [counter, setCounter] = useSelector((state) => state.counter);
  return <span>{counter}</span>;
}
```

## [v3.1.0](https://github.com/iusehooks/usetheform/releases/tag/v3.1.0)

### Improvements:

- `Collection` now accepts `touched` prop for sync validation.
- `Form` is now exported as Named Exports.

## [v3.0.0](https://github.com/iusehooks/usetheform/releases/tag/v3.0.0)

### Improvements:

- Async and Sync fields validation.
- Added `withIndex` HOC.
- Fixed `Input` type number issue.
- Fixed React Strict Mode errors.
- Updated documentation.
- Added new CodeSandbox examples.
- Removed unused code.

## [v2.0.1](https://github.com/iusehooks/usetheform/releases/tag/v2.0.1)

### Improvements:

- Fixed NPM vulnerabilities.

## [v2.0.0](https://github.com/iusehooks/usetheform/releases/tag/v2.0.0)

### Changes:

- SSR fully supported.
- Added new CodeSandbox examples.
- Improved documentation.

## [1.0.0](https://github.com/iusehooks/usetheform/releases/tag/1.0.0)

- UseTheForm 1.0.0 is here! 🎉
