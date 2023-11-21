/* eslint-disable react/prop-types */
const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button className="button" onClick={() => handleDelete(person)}>delete</button>
    </p>
  );
};

export default Person;
