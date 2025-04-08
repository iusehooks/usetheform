/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable  react/jsx-no-undef */
const { useEffect, useState } = React;
const {
  SimpleForm,
  SimpleFormWithAsync,
  BigForm,
  FormSyncValidation,
  FormContextWithValidation,
  BigFormCollectionArray,
  BigFormCollectionArrayDeepNested,
  BigFormCollectionObjectDeepNested,
  FormWithCustomInputAndSelector,
  FormWithAction,
  WizardForm,
  FormPersistStateOnUnmount
} = window;

window._FormSuites_ = () => {
  const [formLoaded, setLoading] = useState(() => null);

  useEffect(() => {
    const formValue = new URL(window.location.href).searchParams.get("form");
    setTimeout(() => {
      setLoading(formValue);
    }, 1000); // Implemented a delay to mimic loading and allow Cypress to initialize its spies reliably.
  }, []);

  if (!formLoaded) return <div>Loading...</div>;

  return (
    <React.StrictMode>
      {formLoaded === "FormSyncValidation" && <FormSyncValidation />} <br />
      {formLoaded === "FormContextWithValidation" && (
        <FormContextWithValidation />
      )}
      <br />
      {formLoaded === "SimpleFormWithAsync" && <SimpleFormWithAsync />}
      <br />
      {formLoaded === "SimpleForm" && <SimpleForm />} <br />
      {formLoaded === "BigForm" && <BigForm />} <br />
      {formLoaded === "BigFormCollectionArray" && <BigFormCollectionArray />}
      {formLoaded === "BigFormCollectionArrayDeepNested" && (
        <BigFormCollectionArrayDeepNested />
      )}
      {formLoaded === "BigFormCollectionObjectDeepNested" && (
        <BigFormCollectionObjectDeepNested />
      )}
      {formLoaded === "FormWithCustomInputAndSelector" && (
        <FormWithCustomInputAndSelector />
      )}
      {formLoaded === "FormWithAction" && <FormWithAction />}
      {formLoaded === "WizardForm" && <WizardForm />}
      {formLoaded === "FormPersistStateOnUnmount" && (
        <FormPersistStateOnUnmount />
      )}
    </React.StrictMode>
  );
};
