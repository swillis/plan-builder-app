// Exercise type and database for use in the plan builder
export interface Exercise {
  name: string;
  primaryMuscle: string;
  secondaryMuscle: string;
  category: string;
  sets?: number;
}

export const exerciseDatabase: Exercise[] = [
  // Chest
  { name: 'Barbell Bench Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest' },
  { name: 'Dumbbell Bench Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest' },
  { name: 'Incline Dumbbell Press', primaryMuscle: 'Chest', secondaryMuscle: 'Shoulders', category: 'Chest' },
  { name: 'Decline Bench Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest' },
  { name: 'Machine Chest Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest' },
  { name: 'Push-Up', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest' },
  { name: 'Wide Push-Up', primaryMuscle: 'Chest', secondaryMuscle: 'Shoulders', category: 'Chest' },
  { name: 'Pec Deck / Chest Fly', primaryMuscle: 'Chest', secondaryMuscle: '', category: 'Chest' },
  { name: 'Cable Chest Fly', primaryMuscle: 'Chest', secondaryMuscle: '', category: 'Chest' },
  
  // Back
  { name: 'Pull-Up', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back' },
  { name: 'Chin-Up', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back' },
  { name: 'Lat Pulldown', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back' },
  { name: 'Barbell Row', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back' },
  { name: 'Dumbbell Row', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back' },
  { name: 'Seated Cable Row', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back' },
  { name: 'T-Bar Row', primaryMuscle: 'Back', secondaryMuscle: 'Shoulders', category: 'Back' },
  { name: 'Machine Row', primaryMuscle: 'Back', secondaryMuscle: '', category: 'Back' },
  { name: 'Face Pull', primaryMuscle: 'Shoulders', secondaryMuscle: 'Back', category: 'Back' },
  
  // Shoulders
  { name: 'Overhead Barbell Press', primaryMuscle: 'Shoulders', secondaryMuscle: 'Triceps', category: 'Shoulders' },
  { name: 'Dumbbell Shoulder Press', primaryMuscle: 'Shoulders', secondaryMuscle: 'Triceps', category: 'Shoulders' },
  { name: 'Arnold Press', primaryMuscle: 'Shoulders', secondaryMuscle: 'Triceps', category: 'Shoulders' },
  { name: 'Lateral Raise', primaryMuscle: 'Shoulders', secondaryMuscle: '', category: 'Shoulders' },
  { name: 'Front Raise', primaryMuscle: 'Shoulders', secondaryMuscle: '', category: 'Shoulders' },
  { name: 'Rear Delt Fly', primaryMuscle: 'Shoulders', secondaryMuscle: '', category: 'Shoulders' },
  { name: 'Upright Row', primaryMuscle: 'Shoulders', secondaryMuscle: 'Back', category: 'Shoulders' },
  { name: 'Cable Lateral Raise', primaryMuscle: 'Shoulders', secondaryMuscle: '', category: 'Shoulders' },
  
  // Biceps
  { name: 'Barbell Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps' },
  { name: 'Dumbbell Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps' },
  { name: 'Hammer Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps' },
  { name: 'Preacher Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps' },
  { name: 'Cable Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps' },
  { name: 'Concentration Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps' },
  { name: 'Incline Dumbbell Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps' },
  
  // Triceps
  { name: 'Tricep Pushdown', primaryMuscle: 'Triceps', secondaryMuscle: '', category: 'Triceps' },
  { name: 'Overhead Tricep Extension', primaryMuscle: 'Triceps', secondaryMuscle: '', category: 'Triceps' },
  { name: 'Skullcrusher', primaryMuscle: 'Triceps', secondaryMuscle: '', category: 'Triceps' },
  { name: 'Dips', primaryMuscle: 'Triceps', secondaryMuscle: 'Chest', category: 'Triceps' },
  { name: 'Close-Grip Bench Press', primaryMuscle: 'Triceps', secondaryMuscle: 'Chest', category: 'Triceps' },
  { name: 'Dumbbell Kickback', primaryMuscle: 'Triceps', secondaryMuscle: '', category: 'Triceps' },
  { name: 'Cable Overhead Extension', primaryMuscle: 'Triceps', secondaryMuscle: '', category: 'Triceps' },
  
  // Quads
  { name: 'Back Squat', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads' },
  { name: 'Front Squat', primaryMuscle: 'Quads', secondaryMuscle: 'Abs', category: 'Quads' },
  { name: 'Bulgarian Split Squat', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads' },
  { name: 'Walking Lunge', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads' },
  { name: 'Step-Up', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads' },
  { name: 'Leg Press', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads' },
  { name: 'Leg Extension', primaryMuscle: 'Quads', secondaryMuscle: '', category: 'Quads' },
  
  // Hamstrings
  { name: 'Romanian Deadlift', primaryMuscle: 'Hamstrings', secondaryMuscle: 'Glutes', category: 'Hamstrings' },
  { name: 'Stiff-Leg Deadlift', primaryMuscle: 'Hamstrings', secondaryMuscle: 'Glutes', category: 'Hamstrings' },
  { name: 'Seated Leg Curl', primaryMuscle: 'Hamstrings', secondaryMuscle: '', category: 'Hamstrings' },
  { name: 'Lying Leg Curl', primaryMuscle: 'Hamstrings', secondaryMuscle: '', category: 'Hamstrings' },
  { name: 'Nordic Curl', primaryMuscle: 'Hamstrings', secondaryMuscle: '', category: 'Hamstrings' },
  { name: 'Glute-Ham Raise', primaryMuscle: 'Hamstrings', secondaryMuscle: 'Glutes', category: 'Hamstrings' },
  
  // Glutes
  { name: 'Hip Thrust', primaryMuscle: 'Glutes', secondaryMuscle: 'Hamstrings', category: 'Glutes' },
  { name: 'Barbell Glute Bridge', primaryMuscle: 'Glutes', secondaryMuscle: 'Hamstrings', category: 'Glutes' },
  { name: 'Cable Kickback', primaryMuscle: 'Glutes', secondaryMuscle: '', category: 'Glutes' },
  { name: 'Frog Pump', primaryMuscle: 'Glutes', secondaryMuscle: '', category: 'Glutes' },
  { name: 'Banded Glute Bridge', primaryMuscle: 'Glutes', secondaryMuscle: '', category: 'Glutes' },
  
  // Calves
  { name: 'Standing Calf Raise', primaryMuscle: 'Calves', secondaryMuscle: '', category: 'Calves' },
  { name: 'Seated Calf Raise', primaryMuscle: 'Calves', secondaryMuscle: '', category: 'Calves' },
  { name: 'Donkey Calf Raise', primaryMuscle: 'Calves', secondaryMuscle: '', category: 'Calves' },
  { name: 'Leg Press Calf Raise', primaryMuscle: 'Calves', secondaryMuscle: '', category: 'Calves' },
  
  // Abs/Core
  { name: 'Plank', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs' },
  { name: 'Hanging Leg Raise', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs' },
  { name: 'Cable Crunch', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs' },
  { name: 'Sit-Up', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs' },
  { name: 'Russian Twist', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs' },
  { name: 'Side Plank', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs' },
  { name: 'Ab Wheel Rollout', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs' }
]; 