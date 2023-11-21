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
    personService.getAllContacts().then((response) => {
      setPersons(response.data);
    });
  }, []);

  // Event handlers
  const handleSearch = (event) => {
    const search = event.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, search }));
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, newName }));
  };

  const handleNumberChange = (event) => {
    const newNumber = event.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, newNumber }));
  };

  function findIdByName(name) {
    for (const person of persons) {
      if (person.name.toLowerCase() === name.toLowerCase()) {
        return person.id;
      }
    }
    return null;
  }

  const addName = (event) => {
    event.preventDefault();
    const newPerson = {
      name: formData.newName,
      number: formData.newNumber,
    };
    const names = persons.map((person) => person.name.toLowerCase());
    const personName = formData.newName.toLowerCase();
    if (names.includes(personName)) {
      const personId = findIdByName(personName);
      if (
        window.confirm(
          `${formData.newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService.updateContact(personId, newPerson).then((response) => {
          setPersons(
            persons.map((person) =>
              person.id === response.id ? response : person
            )
          );
          setFormData({ ...formData, newName: "", newNumber: "" });
        });
      }
    } else {
      personService.createContact(newPerson).then((response) => {
        setPersons(persons.concat(response.data));
        setFormData({ ...formData, newName: "", newNumber: "" });
      });
    }
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      let deletedPersonId = person.id;
      personService
        .deleteContact(person)
        .then(() =>
          setPersons(persons.filter((person) => person.id !== deletedPersonId))
        );
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
