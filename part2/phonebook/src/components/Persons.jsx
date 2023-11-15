import Person from "./Person";

const Persons = ({ formData, persons }) => {
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

export default Persons;
