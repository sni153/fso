import { ExerciseValues, Result } from "./types";
import { parseArguments } from "./utils";

const calculateExercises = (
  dailyExerciseHours: number[],
  targetHours: number
): Result => {
  const periodLength = dailyExerciseHours.length;
  const trainingDays = dailyExerciseHours.filter((hours) => hours > 0).length;
  const averageHours =
    dailyExerciseHours.reduce((acc, cur) => acc + cur, 0) / periodLength;
  const targetHoursMet = averageHours >= targetHours;
  const rating = targetHoursMet ? 3 : averageHours > 0 ? 2 : 1;
  const ratingDescription =
    rating === 3
      ? "Great job!"
      : rating === 2
      ? "Not too bad but could be better"
      : "You need to get moving!";
  return {
    periodLength,
    trainingDays,
    success: targetHoursMet,
    rating,
    ratingDescription,
    target: targetHours,
    average: averageHours,
  };
};

try {
  const { targetHours, dailyExerciseHours }: ExerciseValues = parseArguments(
    process.argv
  );
  console.log(calculateExercises(dailyExerciseHours, targetHours));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
