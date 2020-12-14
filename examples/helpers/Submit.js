/* eslint-disable react/react-in-jsx-scope */
const { useForm } = UseTheForm;

window.Submit = ({ forceEnable }) => {
  const { isValid, submitted, isSubmitting, submitAttempts } = useForm();
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
