/* eslint-disable react/react-in-jsx-scope */
const { useForm } = UseTheForm;

window.Submit = () => {
  const { isValid, submitted } = useForm();
  return (
    <button data-testid="submit" disabled={!isValid} type="submit">
      Submit
    </button>
  );
};
