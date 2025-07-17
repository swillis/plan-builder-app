// Final expanded hypertrophy-focused exercise database
export interface Exercise {
    name: string;
    primaryMuscle: string;
    secondaryMuscle: string;
    category: string;
    equipment: string;
    movementType: 'Compound' | 'Isolation';
    mechanics: 'Push' | 'Pull' | 'Other';
    sets?: number;
  }
  
  export const exerciseDatabase: Exercise[] = [
    {
      "name": "Ab Wheel Rollout",
      "primaryMuscle": "Abs",
      "secondaryMuscle": "Lower Back",
      "category": "Core",
      "equipment": "Bodyweight",
      "movementType": "Compound",
      "mechanics": "Other"
    },
    {
      "name": "Abduction Machine",
      "primaryMuscle": "Glutes",
      "secondaryMuscle": "Hips",
      "category": "Legs",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Arnold Press",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Triceps",
      "category": "Shoulders",
      "equipment": "Dumbbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Barbell Back Squat",
      "primaryMuscle": "Quads",
      "secondaryMuscle": "Glutes",
      "category": "Legs",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Barbell Bench Press",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Triceps",
      "category": "Chest",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Barbell Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Barbell Good Morning",
      "primaryMuscle": "Hamstrings",
      "secondaryMuscle": "Glutes",
      "category": "Hamstrings",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Other"
    },
    {
      "name": "Barbell Overhead Press",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Triceps",
      "category": "Shoulders",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Barbell Row",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Bench Dips",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Chest",
      "category": "Arms",
      "equipment": "Bodyweight",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Cable Chest Fly",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Shoulders",
      "category": "Chest",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Chest Press",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Triceps",
      "category": "Chest",
      "equipment": "Cable",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Cable Crunch",
      "primaryMuscle": "Abs",
      "secondaryMuscle": "Obliques",
      "category": "Core",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Other"
    },
    {
      "name": "Cable Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Cable Front Raise",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Upper Chest",
      "category": "Shoulders",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Kickback",
      "primaryMuscle": "Glutes",
      "secondaryMuscle": "Hamstrings",
      "category": "Legs",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Lateral Raise",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "None",
      "category": "Shoulders",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Lateral Raise (Behind Back)",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Traps",
      "category": "Shoulders",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Overhead Tricep Extension",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Shoulders",
      "category": "Arms",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Rope Overhead Triceps Extension",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "None",
      "category": "Triceps",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Rope Tricep Extension",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Cable Row",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Cable",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Cable Tricep Pushdown",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Shoulders",
      "category": "Arms",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Chest Press Machine",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Triceps",
      "category": "Chest",
      "equipment": "Machine",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Chest Supported Row",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Dumbbell",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Close-Grip Bench Press",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Chest",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Concentration Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Dumbbell Bench Press",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Triceps",
      "category": "Chest",
      "equipment": "Dumbbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Dumbbell Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Dumbbell Overhead Tricep Extension",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Shoulders",
      "category": "Arms",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Dumbbell Romanian Deadlift",
      "primaryMuscle": "Hamstrings",
      "secondaryMuscle": "Glutes",
      "category": "Legs",
      "equipment": "Dumbbell",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Dumbbell Row",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Dumbbell",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Dumbbell Shoulder Press",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Triceps",
      "category": "Shoulders",
      "equipment": "Dumbbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Dumbbell Skull Crushers",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Shoulders",
      "category": "Arms",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "EZ Bar Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Biceps",
      "equipment": "EZ Bar",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "EZ-Bar Skull Crushers",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Shoulders",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Front Raise",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Upper Chest",
      "category": "Shoulders",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Glute Bridge",
      "primaryMuscle": "Glutes",
      "secondaryMuscle": "Hamstrings",
      "category": "Legs",
      "equipment": "Bodyweight",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Hammer Curl",
      "primaryMuscle": "Forearms",
      "secondaryMuscle": "Biceps",
      "category": "Arms",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Hanging Leg Raise",
      "primaryMuscle": "Abs",
      "secondaryMuscle": "Hip Flexors",
      "category": "Core",
      "equipment": "Bodyweight",
      "movementType": "Isolation",
      "mechanics": "Other"
    },
    {
      "name": "Hip Thrust",
      "primaryMuscle": "Glutes",
      "secondaryMuscle": "Hamstrings",
      "category": "Legs",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Incline Barbell Press",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Shoulders",
      "category": "Chest",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Incline Dumbbell Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Biceps",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Incline Dumbbell Press",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Shoulders",
      "category": "Chest",
      "equipment": "Dumbbell",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Inverted Row",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Bodyweight",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Lat Pulldown",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Machine",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Lateral Raise",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Traps",
      "category": "Shoulders",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Leg Curl Machine",
      "primaryMuscle": "Hamstrings",
      "secondaryMuscle": "Calves",
      "category": "Legs",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Leg Press",
      "primaryMuscle": "Quads",
      "secondaryMuscle": "Glutes",
      "category": "Legs",
      "equipment": "Machine",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Leg Press Calf Raise",
      "primaryMuscle": "Calves",
      "secondaryMuscle": "None",
      "category": "Legs",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Lunge",
      "primaryMuscle": "Quads",
      "secondaryMuscle": "Glutes",
      "category": "Legs",
      "equipment": "Bodyweight",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Machine Chest Fly",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Shoulders",
      "category": "Chest",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Machine Chest Press",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Triceps",
      "category": "Chest",
      "equipment": "Machine",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Machine Crunch",
      "primaryMuscle": "Abs",
      "secondaryMuscle": "Obliques",
      "category": "Core",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Other"
    },
    {
      "name": "Machine Shoulder Press",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Triceps",
      "category": "Shoulders",
      "equipment": "Machine",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Pec Deck Machine",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Shoulders",
      "category": "Chest",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Preacher Curl Machine",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Pull-Up",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Bodyweight",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Push-Up",
      "primaryMuscle": "Chest",
      "secondaryMuscle": "Triceps",
      "category": "Chest",
      "equipment": "Bodyweight",
      "movementType": "Compound",
      "mechanics": "Push"
    },
    {
      "name": "Reverse Barbell Curl",
      "primaryMuscle": "Forearms",
      "secondaryMuscle": "Biceps",
      "category": "Forearms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Reverse Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Reverse Wrist Curl",
      "primaryMuscle": "Forearms",
      "secondaryMuscle": "Biceps",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Romanian Deadlift",
      "primaryMuscle": "Hamstrings",
      "secondaryMuscle": "Glutes",
      "category": "Legs",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Russian Twist",
      "primaryMuscle": "Obliques",
      "secondaryMuscle": "Abs",
      "category": "Core",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Other"
    },
    {
      "name": "Seated Calf Raise",
      "primaryMuscle": "Calves",
      "secondaryMuscle": "None",
      "category": "Calves",
      "equipment": "Machine",
      "movementType": "Isolation",
      "mechanics": "Other"
    },
    {
      "name": "Skull Crushers",
      "primaryMuscle": "Triceps",
      "secondaryMuscle": "Shoulders",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Smith Machine Calf Raise",
      "primaryMuscle": "Calves",
      "secondaryMuscle": "None",
      "category": "Legs",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Spider Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Standing Calf Raise",
      "primaryMuscle": "Calves",
      "secondaryMuscle": "None",
      "category": "Legs",
      "equipment": "Bodyweight",
      "movementType": "Isolation",
      "mechanics": "Push"
    },
    {
      "name": "Straight Arm Pulldown",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Lats",
      "category": "Back",
      "equipment": "Cable",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "T-Bar Row",
      "primaryMuscle": "Back",
      "secondaryMuscle": "Biceps",
      "category": "Back",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Upright Row",
      "primaryMuscle": "Shoulders",
      "secondaryMuscle": "Traps",
      "category": "Shoulders",
      "equipment": "Barbell",
      "movementType": "Compound",
      "mechanics": "Pull"
    },
    {
      "name": "Weighted Decline Sit-Up",
      "primaryMuscle": "Abs",
      "secondaryMuscle": "Hip Flexors",
      "category": "Core",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Other"
    },
    {
      "name": "Wrist Curl",
      "primaryMuscle": "Forearms",
      "secondaryMuscle": "Biceps",
      "category": "Arms",
      "equipment": "Barbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    },
    {
      "name": "Zottman Curl",
      "primaryMuscle": "Biceps",
      "secondaryMuscle": "Forearms",
      "category": "Arms",
      "equipment": "Dumbbell",
      "movementType": "Isolation",
      "mechanics": "Pull"
    }
  ];