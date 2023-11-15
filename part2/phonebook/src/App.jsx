/* eslint-disable react/prop-types */
import { useState } from "react";

const App = () => {
  // State variables
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  const [formData, setFormData] = useState({
    newName: "",
    newNumber: "",
    search: "",
  });

  // Component-specific variables
  const Person = ({ person }) => {
    return (
      <p>
        {person.name} {person.number}
      </p>
    );
  };

  // Event handlers
  const handleSearch = (event) => {
    setFormData({ ...formData, search: event.target.value });
  };

  const handleNameChange = (event) => {
    setFormData({ ...formData, newName: event.target.value });
  };

  const handleNumberChange = (event) => {
    setFormData({ ...formData, newNumber: event.target.value });
  };

  const addName = (event) => {
    event.preventDefault();
    const newPerson = {
      name: formData.newName,
      number: formData.newNumber,
    };
    const names = persons.map((person) => person.name.toLowerCase());
    if (names.includes(formData.newName.toLowerCase())) {
      alert(`${formData.newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPerson));
      setFormData({ ...formData, newName: "", newNumber: "" });
    }
  };

  // Render function
  const PeopleToDisplay = () => {
    if (formData.search) {
      return persons
        .filter((person) => person.name.includes(formData.search))
        .map((person) => <Person key={person.name} person={person} />);
    } else {
      return persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ));
    }
  };

  // Component JSX
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with{" "}
        <input value={formData.search} onChange={handleSearch}></input>
      </div>
      <h2>add a new</h2>
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
      <h2>Numbers</h2>
      <PeopleToDisplay />
    </div>
  );
};

export default App;
