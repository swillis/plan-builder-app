// Updated exercise database using the comprehensive exercises.json dataset
export interface Exercise {
  name: string;
  primaryMuscle: string;
  secondaryMuscle: string;
  category: string;
  equipment: string;
  movementType: 'Compound' | 'Isolation';
  mechanics: 'Push' | 'Pull' | 'Other';
  sets?: number;
  // Additional fields from the comprehensive dataset
  id?: string;
  bodyPart?: string;
  target?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  description?: string;
  difficulty?: string;
}

// Import the comprehensive exercise data
import exerciseData from './exercises.json';

// Helper function to determine movement type based on exercise characteristics
function determineMovementType(exercise: any): 'Compound' | 'Isolation' {
  const compoundKeywords = ['squat', 'deadlift', 'press', 'row', 'pull', 'push', 'clean', 'snatch', 'lunge'];
  const isolationKeywords = ['curl', 'extension', 'raise', 'crunch', 'twist', 'fly'];
  
  const name = exercise.name.toLowerCase();
  
  for (const keyword of compoundKeywords) {
    if (name.includes(keyword)) return 'Compound';
  }
  
  for (const keyword of isolationKeywords) {
    if (name.includes(keyword)) return 'Isolation';
  }
  
  // Default to compound for most exercises
  return 'Compound';
}

// Helper function to determine mechanics based on exercise characteristics
function determineMechanics(exercise: any): 'Push' | 'Pull' | 'Other' {
  const pushKeywords = ['press', 'push', 'extension', 'thrust', 'squat', 'lunge'];
  const pullKeywords = ['row', 'pull', 'curl', 'deadlift', 'pulldown'];
  
  const name = exercise.name.toLowerCase();
  
  for (const keyword of pushKeywords) {
    if (name.includes(keyword)) return 'Push';
  }
  
  for (const keyword of pullKeywords) {
    if (name.includes(keyword)) return 'Pull';
  }
  
  return 'Other';
}

// Helper function to map body parts to muscle groups
function mapBodyPartToMuscle(bodyPart: string): string {
  const muscleMap: { [key: string]: string } = {
    'waist': 'Abs',
    'back': 'Back',
    'chest': 'Chest',
    'upper arms': 'Arms',
    'lower arms': 'Forearms',
    'upper legs': 'Legs',
    'lower legs': 'Calves',
    'shoulders': 'Shoulders',
    'neck': 'Neck',
    'cardio': 'Cardio'
  };
  
  return muscleMap[bodyPart] || bodyPart;
}

// Helper function to map target muscles to primary muscle
function mapTargetToPrimaryMuscle(target: string): string {
  const muscleMap: { [key: string]: string } = {
    'abs': 'Abs',
    'lats': 'Back',
    'pectorals': 'Chest',
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'quads': 'Quads',
    'glutes': 'Glutes',
    'hamstrings': 'Hamstrings',
    'calves': 'Calves',
    'delts': 'Shoulders',
    'shoulders': 'Shoulders',
    'traps': 'Back',
    'forearms': 'Forearms',
    'obliques': 'Abs',
    'serratus anterior': 'Chest',
    'upper back': 'Back',
    'lower back': 'Back',
    'hip flexors': 'Quads',
    'rhomboids': 'Back',
    'trapezius': 'Back'
  };
  
  return muscleMap[target] || target;
}

// Convert the comprehensive exercise data to our app's format
export const exerciseDatabase: Exercise[] = exerciseData.map((exercise: any) => {
  const primaryMuscle = mapTargetToPrimaryMuscle(exercise.target);
  const secondaryMuscles = exercise.secondaryMuscles 
    ? exercise.secondaryMuscles.map(muscle => mapTargetToPrimaryMuscle(muscle)).join(', ')
    : '';
  const category = mapBodyPartToMuscle(exercise.bodyPart);
  const movementType = determineMovementType(exercise);
  const mechanics = determineMechanics(exercise);
  
  return {
    name: exercise.name,
    primaryMuscle,
    secondaryMuscle: secondaryMuscles,
    category,
    equipment: exercise.equipment,
    movementType,
    mechanics,
    // Additional fields from comprehensive dataset
    id: exercise.id,
    bodyPart: exercise.bodyPart,
    target: exercise.target,
    secondaryMuscles: exercise.secondaryMuscles,
    instructions: exercise.instructions,
    description: exercise.description,
    difficulty: exercise.difficulty
  };
});

// Export the original comprehensive data for potential future use
export const comprehensiveExerciseData = exerciseData;