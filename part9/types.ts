export interface ExerciseValues {
  targetHours: number;
  dailyExerciseHours: Array<number>;
}

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}