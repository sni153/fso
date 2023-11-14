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

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </>
  );
};

export default App;
