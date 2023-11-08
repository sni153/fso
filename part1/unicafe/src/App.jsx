/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";

const Header = ({ title }) => {
  return <h2>{title}</h2>;
};

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return <div>No feedback given</div>;
  } else {
    return (
      <>
        <Header title="statistics" />
        <div>
          <Statistic text="good" count={good} />
          <Statistic text="neutral" count={neutral} />
          <Statistic text="bad" count={bad} />
          <Statistic text="all" count={all} />
          <Statistic text="average" count={average} />
          <Statistic text="positive" count={positive} symbol="%" />
        </div>
      </>
    );
  }
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
  const average = (good * 1 + bad * -1) / all;
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
      <Header title="give feedback" />
      <div className="button-container">
        <Button text="good" handleClick={handleGoodClick} />
        <Button text="neutral" handleClick={handleNeutralClick} />
        <Button text="bad" handleClick={handleBadClick} />
      </div>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </>
  );
};

export default App;
