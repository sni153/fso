/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import "./App.css";

const App = () => {
  // State variables
  const [persons, setPersons] = useState([]);
  const [formData, setFormData] = useState({
    newName: "",
    newNumber: "",
    search: "",
  });

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  // Event handlers
  const handleSearch = (event) => {
    const search = event.target.value;
    setFormData((prevData) => ({ ...prevData, search }));
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
      personService.create(newPerson).then((response) => {
        setPersons(persons.concat(response.data));
        setFormData({ ...formData, newName: "", newNumber: "" });
      });
    }
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      let deletedPersonId = person.id;
      personService.deleteContact(person).then(() => setPersons(persons.filter(person => person.id !== deletedPersonId )));
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
      <Persons
        formData={formData}
        persons={persons}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
