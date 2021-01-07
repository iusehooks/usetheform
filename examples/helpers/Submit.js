/* eslint-disable react/react-in-jsx-scope */
const { useForm } = UseTheForm;

window.Submit = ({ forceEnable }) => {
  const { isValid } = useForm();
  return (
    <button
      data-testid="submit"
      disabled={forceEnable ? false : !isValid}
      type="submit"
    >
      Submit
    </button>
  );
};
