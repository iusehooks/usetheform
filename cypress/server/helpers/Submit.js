/* eslint-disable react/react-in-jsx-scope */
const { useForm } = UseTheForm;

window.Submit = ({ data_prefix = "", forceEnable }) => {
  const { isValid } = useForm();
  return (
    <button
      data-testid={`${data_prefix}submit`}
      disabled={forceEnable ? false : !isValid}
      type="submit"
    >
      Submit
    </button>
  );
};
