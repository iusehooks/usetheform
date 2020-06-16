/* eslint-disable react/react-in-jsx-scope */
const { useForm } = UseTheForm;

window.Reset = () => {
  const { reset, pristine } = useForm();
  return (
    <button data-testid="reset" type="button" onClick={reset}>
      Reset
    </button>
  );
};
