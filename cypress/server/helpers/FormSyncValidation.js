/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input, useValidation } = UseTheForm;

const { Reset, Submit } = window;

window.FormSyncValidation = props => {
  const isValidEmail = value =>
    !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
      ? undefined
      : "Mail not Valid";
  const required = value =>
    value && value.trim() !== "" ? undefined : "Required";
  const [statusInput, validationInput] = useValidation([
    required,
    isValidEmail
  ]);

  const graterThan10 = value =>
    value && value["A"] + value["B"] > 10 ? undefined : "A+B must be > 10";
  const [statusCollection, validationCollection] = useValidation([
    graterThan10
  ]);

  const graterThan10InnerCollection = value => {
    return value && value[0] + value[1] > 10
      ? undefined
      : "Value[0]+Value[1] must be > 10";
  };
  const [
    statusCollectionInnerCollection,
    validationCollectionInnerCollection
  ] = useValidation([graterThan10InnerCollection]);

  const checkBoxInnerCollection = value => {
    return value &&
      value.OptionA === 1 &&
      value.OptionB === 1 &&
      value.OptionC === 1
      ? undefined
      : "Checkboxes must be checked!";
  };
  const [
    statusCheckBoxInnerCollection,
    validationCheckBoxInnerCollection
  ] = useValidation([checkBoxInnerCollection]);

  const checkBoxInnerCollectionArray = value => {
    return value &&
      value.checkboxes[0] === "ok" &&
      value.checkboxes[1] === "ok" &&
      value.checkboxes[2] == 1
      ? undefined
      : "Checkboxes must be checked!1111";
  };
  const [
    statusCheckBoxInnerCollectionArray,
    validationCheckBoxInnerCollectionArray
  ] = useValidation([checkBoxInnerCollectionArray]);

  return (
    <Form
      data-testid="FormSyncValidation-Form"
      onChange={(state, isValid) =>
        console.log("onChange,FormSyncValidation", state, isValid)
      }
      onInit={(state, isValid) => {
        console.log("onInit,FormSyncValidation", state, isValid);
      }}
      onReset={(state, isValid) =>
        console.log("onReset,FormSyncValidation", state, isValid)
      }
      onSubmit={(state, isValid) =>
        console.log("onSubmit,FormSyncValidation", state, isValid)
      }
      {...props}
    >
      <Input
        type="text"
        name="email"
        data-testid="emailFormSyncValidation"
        touched
        placeholder="Email"
        {...validationInput}
      />
      {statusInput.error && (
        <label data-testid="statusInputEmailErrorLabel">
          {statusInput.error}
        </label>
      )}

      <Collection object name="sum" {...validationCollection}>
        <Input
          type="number"
          data-testid="sumInputFormSyncValidation"
          name="A"
          value="1"
          placeholder="Number A"
        />
        <Input type="number" name="B" value="2" placeholder="Number B" />
      </Collection>
      {statusCollection.error && (
        <label data-testid="statusCollectionErrorLabel">
          {statusCollection.error}
        </label>
      )}

      <Collection object name="innerCollection">
        <Collection array name="sum" {...validationCollectionInnerCollection}>
          <Input
            type="number"
            data-testid="sumInputFormSyncValidationArray"
            value="1"
            placeholder="Number A"
          />
          <Input type="number" value="2" placeholder="Number B" />
        </Collection>
      </Collection>
      {statusCollectionInnerCollection.error && (
        <label data-testid="statusInnerCollectionErrorLabel">
          {statusCollectionInnerCollection.error}
        </label>
      )}

      <Collection
        object
        name="innerCollectionCheckbox"
        {...validationCheckBoxInnerCollection}
      >
        <Input
          type="checkbox"
          name="OptionA"
          checked
          value={1}
          placeholder="Option A"
        />
        <Input
          type="checkbox"
          name="OptionB"
          data-testid="checkboxeFormSyncValidation"
          value={1}
          placeholder="Option B"
        />
        <Input
          type="radio"
          checked
          name="OptionC"
          value={1}
          placeholder="Option C"
        />
      </Collection>

      {statusCheckBoxInnerCollection.error && (
        <label data-testid="statusCheckBoxInnerCollection">
          {statusCheckBoxInnerCollection.error}
        </label>
      )}

      <Collection
        object
        name="innerCollectionCheckboxArray"
        {...validationCheckBoxInnerCollectionArray}
      >
        <Collection array name="checkboxes">
          <Input type="checkbox" checked value="ok" placeholder="Option A" />
          <Input
            type="checkbox"
            data-testid="checkboxeFormSyncValidationArray"
            value="ok"
            placeholder="Option B"
          />
          <Input type="radio" checked value={1} placeholder="Option C" />
        </Collection>
      </Collection>

      {statusCheckBoxInnerCollectionArray.error && (
        <label data-testid="statusCheckBoxInnerCollectionArray">
          {statusCheckBoxInnerCollectionArray.error}
        </label>
      )}

      <Input
        type="file"
        name="fileUpload"
        data-testid="fileUploadFormSyncValidation"
        placeholder="Upload File"
      />

      <button data-testid="FormSyncValidationSeeResults" type="submit">
        Press to see results
      </button>
      <Submit data_prefix="FormSyncValidation-" />
      <Reset data_prefix="FormSyncValidation-" />
    </Form>
  );
};
