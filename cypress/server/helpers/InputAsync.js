/* eslint-disable react/react-in-jsx-scope */
const { useAsyncValidation, Input } = UseTheForm;

const asyncTestInputAsync = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.length <= 3) {
        reject("Error");
      } else {
        resolve("Success");
      }
    }, 2000);
  });

window.InputAsync = ({ name, dataTestid = "asyncinput", value, index }) => {
  const [asyncStatus, asyncValidation] = useAsyncValidation(
    asyncTestInputAsync
  );
  return (
    <div data-testid="asyncinput_wrapper">
      <label>InputAsync: </label>
      <Input
        touched
        index={index}
        name={name}
        {...asyncValidation}
        type="text"
        value={value}
        data-testid={dataTestid}
      />
      {asyncStatus.status === undefined && (
        <label data-testid={`asyncNotStartedYet-${dataTestid}`}>
          asyncNotStartedYet
        </label>
      )}
      {asyncStatus.status === "asyncStart" && (
        <label data-testid={`asyncStart-${dataTestid}`}>Checking...</label>
      )}
      {asyncStatus.status === "asyncError" && (
        <label data-testid={`asyncError-${dataTestid}`}>
          {asyncStatus.value}
        </label>
      )}
      {asyncStatus.status === "asyncSuccess" && (
        <label data-testid={`asyncSuccess-${dataTestid}`}>
          {asyncStatus.value}
        </label>
      )}
    </div>
  );
};
