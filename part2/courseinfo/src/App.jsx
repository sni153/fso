/* eslint-disable react/prop-types */
const Header = ({ name }) => <h1>{name}</h1>;

const Part = ({ part }) => (
  <div>
    {part.name} {part.exercises}
  </div>
);

const Content = ({ course }) =>
  course.parts.map((part) => <Part key={part.id} part={part} />);

const Course = ({ course }) => (
  <>
    <Header name={course.name} />
    <Content course={course} />
  </>
);

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
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
    ],
  };

  return <Course course={course} />;
};

export default App;
