/* eslint-disable react/prop-types */
import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  // State variables
  const [persons, setPersons] = useState([]);
  const [formData, setFormData] = useState({
    newName: "",
    newNumber: "",
    search: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  // Event handlers
  const handleSearch = (event) => {
    const search = event.target.value;
    setFormData((prevData) => ({...prevData, search}));
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setFormData((prevData) => ({ ...prevData, newName }));
  };

  const handleNumberChange = (event) => {
    const newNumber = event.target.value;
    setFormData((prevData) => ({ ...prevData, newNumber }));
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
