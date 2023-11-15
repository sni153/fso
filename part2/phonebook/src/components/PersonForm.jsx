const PersonForm = ({
  formData,
  addName,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={formData.newName} onChange={handleNameChange} />
      </div>
      <div>
        number:{" "}
        <input value={formData.newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
