/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Input, PersistStateOnUnmount, Collection } = UseTheForm;

const { useState } = React;
const { Reset, Submit } = window;

window.FormPersistStateOnUnmount = () => {
  const [visible, toggle] = useState(false);
  return (
    <Form
      data-testid="FormPersistStateOnUnmount-Form"
      onSubmit={(state, isValid) => {
        console.log(
          "onSubmit,consoleLogFormPersistStateOnUnmount",
          state,
          isValid
        );
      }}
      onChange={(state, isValid) =>
        console.log(
          "onChange,consoleLogFormPersistStateOnUnmount",
          state,
          isValid
        )
      }
      onReset={(state, isValid) =>
        console.log(
          "onReset,consoleLogFormPersistStateOnUnmount",
          state,
          isValid
        )
      }
      onInit={(state, isValid) => {
        console.log(
          "onInit,consoleLogFormPersistStateOnUnmount",
          state,
          isValid
        );
      }}
    >
      <PersistStateOnUnmount>
        {!visible && (
          <div>
            <Collection object name="user">
              <Input
                data-testid="FormPersistStateOnUnmount-input-name"
                type="text"
                name="name"
                value="abc"
              />
              <Input
                data-testid="FormPersistStateOnUnmount-input-lastname"
                type="text"
                name="lastname"
                value="foo"
              />
            </Collection>
            <Collection array name="inputs">
              <Collection array>
                <Input
                  data-testid="FormPersistStateOnUnmount-input-array"
                  type="text"
                  value="1"
                />
              </Collection>
            </Collection>
          </div>
        )}
        <Input
          data-testid="FormPersistStateOnUnmount-other"
          type="text"
          name="other"
        />
      </PersistStateOnUnmount>
      <Reset data_prefix="FormPersistStateOnUnmount-" />
      <Submit data_prefix="FormPersistStateOnUnmount-" />
      <button
        type="button"
        data-testid="FormPersistStateOnUnmount-button"
        onClick={() => toggle(prev => !prev)}
      >
        Toggle Collection
      </button>
    </Form>
  );
};
