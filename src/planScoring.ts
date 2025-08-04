// Type definitions (copied from PlanBuilder.tsx)
export interface Exercise {
  name: string;
  primaryMuscle: string;
  secondaryMuscle: string;
  category: string;
  sets?: number;
}

export interface Day {
  name: string;
  exercises: Exercise[];
}

/**
 * Evaluates a training plan and returns a score and letter grade.
 * @param plan - The training plan JSON (array of days with exercises)
 * @param experience - User's experience level ("Beginner", "Intermediate", "Advanced")
 * @param focusAreas - Array of focus area muscle groups
 * @returns { score: number, grade: string, details: string[] }
 */
export function scoreTrainingPlan(plan: Day[], experience: string, focusAreas: string[]): { score: number, grade: string, details: string[] } {
  // Experience set recommendations
  const experienceRanges: Record<string, [number, number]> = {
    Beginner: [50, 70],
    Intermediate: [70, 110],
    Advanced: [100, 140]
  };
  const muscleGroups = [
    'Chest', 'Back', 'Quads', 'Hamstrings', 'Glutes', 
    'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs'
  ];
  // Calculate total sets, volume/frequency per muscle
  const volumeMap: Record<string, number> = {};
  const frequencyMap: Record<string, number> = {};
  muscleGroups.forEach((muscle: string) => {
    volumeMap[muscle] = 0;
    frequencyMap[muscle] = 0;
  });
  plan.forEach((day: Day) => {
    const trainedMuscles = new Set<string>();
    day.exercises.forEach((exercise: Exercise) => {
      if (exercise.primaryMuscle) {
        volumeMap[exercise.primaryMuscle] += exercise.sets || 0;
        trainedMuscles.add(exercise.primaryMuscle);
      }
    });
    trainedMuscles.forEach((muscle: string) => {
      frequencyMap[muscle] += 1;
    });
  });
  const totalSets = plan.reduce((total: number, day: Day) => total + day.exercises.reduce((d: number, ex: Exercise) => d + (ex.sets || 0), 0), 0);
  // Score components
  let score = 100;
  const details: string[] = [];
  // 1. Experience level set range
  const [minSets, maxSets] = experienceRanges[experience] || [70, 110];
  if (totalSets < minSets) {
    score -= 20;
    details.push(`Total sets (${totalSets}) is below recommended for ${experience} (${minSets}-${maxSets})`);
  } else if (totalSets > maxSets) {
    score -= 10;
    details.push(`Total sets (${totalSets}) is above recommended for ${experience} (${minSets}-${maxSets})`);
  } else {
    details.push(`Total sets (${totalSets}) is within recommended range for ${experience}`);
  }
  // 2. Focus area volume/frequency
  focusAreas.forEach((muscle: string) => {
    const vol = volumeMap[muscle] || 0;
    const freq = frequencyMap[muscle] || 0;
    if (vol < 12) {
      score -= 10;
      details.push(`${muscle}: Volume low (${vol} sets, <12)`);
    } else {
      details.push(`${muscle}: Volume good (${vol} sets)`);
    }
    if (freq < 2) {
      score -= 10;
      details.push(`${muscle}: Frequency low (${freq}x, <2x/week)`);
    } else {
      details.push(`${muscle}: Frequency good (${freq}x/week)`);
    }
  });
  // 3. Overtraining penalty (any muscle > 20 sets)
  muscleGroups.forEach((muscle: string) => {
    if (volumeMap[muscle] > 20) {
      score -= 5;
      details.push(`${muscle}: High volume (${volumeMap[muscle]} sets, >20)`);
    }
  });
  // Clamp score
  if (score < 0) score = 0;
  if (score > 100) score = 100;
  // Letter grade
  let grade = 'A';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  return { score, grade, details };
} 