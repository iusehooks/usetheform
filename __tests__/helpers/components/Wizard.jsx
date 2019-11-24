import React, { useState } from "react";
import Form, { Input, useMultipleForm } from "./../../../src";

export default function Wizard({ onSubmitWizard, onChangeWizard }) {
  const [page, setState] = useState(1);
  const nextPage = () => setState(prev => ++prev);
  const prevPage = () => setState(prev => --prev);

  const [getWizardState, wizard] = useMultipleForm(onChangeWizard);
  const onSubmit = () => onSubmitWizard(getWizardState());

  return (
    <div className="Wizard">
      {page === 1 && (
        <Form name="form1" {...wizard} onSubmit={nextPage}>
          <Input type="text" name="name" data-testid="name" />
          <button type="submit" data-testid="next">
            Next
          </button>
        </Form>
      )}
      {page === 2 && (
        <Form name="form2" {...wizard} onSubmit={onSubmit}>
          <Input type="text" name="lastname" data-testid="lastname" />
          <button type="button" onClick={prevPage} data-testid="prev">
            Prev
          </button>
          <button type="submit" data-testid="submit">
            Submit
          </button>
        </Form>
      )}
    </div>
  );
}
