import Person from "./Person";

const Persons = ({ formData, persons, handleDelete }) => {
  if (formData.search) {
    return persons
      .filter((person) => person.name.includes(formData.search))
      .map((person) => <Person key={person.name} person={person} />);
  } else {
    return persons.map((person) => (
      <Person key={person.name} person={person} handleDelete={handleDelete}/>
    ));
  }
};

export default Persons;
