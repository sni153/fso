import { ExerciseValues } from "./types";

export const parseArguments = (args: Array<string>): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const targetHours = Number(args[2]);
  const dailyExerciseHours = args.slice(3).map(Number);

  if (isNaN(targetHours) || dailyExerciseHours.some(isNaN)) {
    throw new Error("Provided values were not numbers!");
  }

  return {
    targetHours,
    dailyExerciseHours,
  };
};
