/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const Statistic = (props) => {
  return (
    <div>
      {props.text} {props.count} {props.symbol}
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;
  const average = ((good * 1) + (bad * -1)) / all;
  const positive = (good / all) * 100;

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
        <Statistic text="all" count={all} />
        <Statistic text="average" count={average} />
        <Statistic text="positive" count={positive} symbol="%"/>
      </div>
    </>
  );
};

export default App;
