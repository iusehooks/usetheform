/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input } = UseTheForm;

const { useState } = React;

let fooBigFormCollection = new Array(100); // create an empty array with length 45
for (let i = 0; i < fooBigFormCollection.length; i++) {
  fooBigFormCollection[i] = i;
}

window.BigFormCollectionArray = () => {
  const [inputs] = useState(() =>
    fooBigFormCollection.map((_, index) => (
      <Input
        type="text"
        key={index}
        value={`${index}`}
        data-testid={`BigFormCollectionArray-input-${index}`}
      />
    ))
  );

  return (
    <div>
      <Form
        onInit={(state, isValid) => {
          console.log(
            "onInit,consoleLogBigFormCollectionArray",
            state,
            isValid
          );
        }}
        data-testid="BigFormCollectionArray-Form"
      >
        <Collection array name="array">
          {inputs}
        </Collection>
      </Form>
    </div>
  );
};
