/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const Statistic = (props) => {
  return (
    <div>
      {props.text} {props.count}
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
  };
  return (
    <>
      <h3>give feedback</h3>
      <div className="button-container">
        <Button text="good" handleClick={handleGoodClick} />
        <Button text="neutral" handleClick={handleNeutralClick} />
        <Button text="bad" handleClick={handleBadClick} />
      </div>
      <h3>statistics</h3>
      <div>
        <Statistic text="good" count={good} />
        <Statistic text="neutral" count={neutral} />
        <Statistic text="bad" count={bad} />
      </div>
    </>
  );
};

export default App;
