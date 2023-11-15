/* eslint-disable react/prop-types */
const Person = ({ person }) => {
  return (
    <p>
      {person.name} {person.number}
    </p>
  );
};

export default Person;
