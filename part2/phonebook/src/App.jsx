/* eslint-disable react/prop-types */
import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

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

  // Component JSX
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter formData={formData} handleSearch={handleSearch} />
      <h3>Add a new</h3>
      <PersonForm
        formData={formData}
        addName={addName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons formData={formData} persons={persons} />
    </div>
  );
};

export default App;
