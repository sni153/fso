/* eslint-disable react/prop-types */
const Header = ({ name }) => <h1>{name}</h1>;

const Part = ({ part }) => (
  <div>
    {part.name} {part.exercises}
  </div>
);

const Content = ({ parts }) => {
  const sum = parts.reduce(
    (accum, currentValue) => accum + currentValue.exercises,
    0
  );

  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <p>
        <b>total of {sum} exercises</b>
      </p>
    </>
  );
};

const Course = ({ course }) => (
  <>
    <Header name={course.name} />
    <Content parts={course.parts} />
  </>
);

export default Course;
