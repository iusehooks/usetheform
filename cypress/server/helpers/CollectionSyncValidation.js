/* eslint-disable react/react-in-jsx-scope */
const { Collection, useValidation, useChildren } = UseTheForm;
const { User } = window;

const minLengthTwoMembers = state => {
  return state && Object.keys(state).length >= 2
    ? undefined
    : "Required at least two Member";
};

const maxLengthFourMembers = state => {
  return state === undefined || (state && Object.keys(state).length <= 4)
    ? undefined
    : "Less Than 4 Members";
};

let index = 0;

window.CollectionValidationTouched = function CollectionValidationTouched() {
  const [status, validation] = useValidation([
    maxLengthFourMembers,
    minLengthTwoMembers
  ]);

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
      <button type="button" data-testid="addMember" onClick={addMember}>
        Add a Member
      </button>
      <button type="button" onClick={removeMember}>
        Remove a Member
      </button>
      <br />
      <Collection object name="wrapper">
        <Collection array touched name="syncValCollection" {...validation}>
          {members.map(member => (
            <User key={member.index} value={member.value} />
          ))}
        </Collection>
      </Collection>
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
    </div>
  );
};
