import useForm from "./useForm";

const noop = _ => undefined;
export const useFormContext = ({
  initialState,
  onChange,
  onInit,
  onReset,
  onSubmit = noop,
  reducers,
  _getInitilaStateForm_, // Private API
  _onMultipleForm_, // Private API
  name
}) => {
  const { onSubmitForm, dispatchNewState, ...value } = useForm({
    initialState,
    onChange,
    onInit,
    onReset,
    onSubmit,
    reducers,
    _getInitilaStateForm_,
    _onMultipleForm_,
    name
  });
  return [onSubmitForm, value, dispatchNewState];
};
