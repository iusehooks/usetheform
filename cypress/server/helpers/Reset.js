/* eslint-disable react/react-in-jsx-scope */
const { useForm, STATUS } = UseTheForm;

window.Reset = ({ data_prefix = "" }) => {
  const { reset, pristine, formStatus } = useForm();
  return (
    <button
      data-testid={`${data_prefix}reset`}
      disabled={
        pristine ||
        formStatus === STATUS.ON_INIT_ASYNC ||
        formStatus === STATUS.ON_RUN_ASYNC
      }
      type="button"
      onClick={reset}
    >
      Reset
    </button>
  );
};
