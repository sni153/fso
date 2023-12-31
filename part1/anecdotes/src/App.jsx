import { useState } from "react";
import "./App.css";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast is to go well.",
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [voteCounts, setVoteCounts] = useState(
    new Array(anecdotes.length).fill(0)
  );

  const getRandomIndex = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelectedIndex(randomIndex);
  };

  const handleVote = () => {
    const newVoteCounts = [...voteCounts];
    newVoteCounts[selectedIndex] += 1;
    setVoteCounts(newVoteCounts);
  };

  const maxVoteCount = Math.max(...voteCounts);

  const getMostVotedAnecdoteIndex = () => {
    const mostVotedIndex = voteCounts.indexOf(maxVoteCount);
    return mostVotedIndex;
  };

  return (
    <div>
      <h3>Anecdote of the day</h3>
      <p>{anecdotes[selectedIndex]}</p>
      <p>has {voteCounts[selectedIndex]} votes</p>
      <button className="mr-3" onClick={handleVote}>
        vote
      </button>
      <button onClick={getRandomIndex}>next anecdote</button>
      <h3>Anecdote with the most votes</h3>
      <p>{anecdotes[getMostVotedAnecdoteIndex()]}</p>
      <p>has {voteCounts[getMostVotedAnecdoteIndex()]} votes</p>
    </div>
  );
};

export default App;
