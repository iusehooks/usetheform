import React from "react";
import { Collection, useValidation, useChildren } from "./../../../src";
import User from "./User";
const minLength = state =>
  state && Object.keys(state).length > 0
    ? undefined
    : "Required at least one Member";

let index = 0;
export default function CollectionValidation() {
  const [status, validation] = useValidation([minLength]);

  const [members, setMembers] = useChildren([]);
  const addMember = () => {
    ++index;
    setMembers(prev => [...prev, { index, value: index }]);
  };

  const removeMember = () => setMembers(prev => prev.slice(0, prev.length - 1));

  return (
    <div>
      <label>Members: (Sync Validation)</label>
      <br />
      <button type="button" onClick={addMember}>
        Add a Member
      </button>
      <button type="button" onClick={removeMember}>
        Remove a Member
      </button>
      <br />
      <Collection array name="syncValCollection" {...validation}>
        {members.map(member => (
          <User key={member.index} value={member.value} />
        ))}
      </Collection>
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
    </div>
  );
}
