import { useState, useEffect } from 'react';
import { Plus, X, Target, TrendingUp, ChevronDown, Search } from 'lucide-react';
import { scoreTrainingPlan } from './planScoring';
import { exerciseDatabase } from './exerciseDatabase';
import type { Exercise } from './exerciseDatabase';

interface Day {
  name: string;
  exercises: Exercise[];
}

interface ExerciseSelectorProps {
  value: string;
  onChange: (exercise: Exercise) => void;
}

interface FeedbackItem {
  muscle: string;
  message: string;
  type: 'warning' | 'info';
}

const ExerciseSelector = ({ value, onChange }: ExerciseSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredExercises = exerciseDatabase.filter((exercise: Exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedExercises = filteredExercises.reduce((groups: Record<string, Exercise[]>, exercise: Exercise) => {
    const category = exercise.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(exercise);
    return groups;
  }, {});

  const handleSelect = (exercise: Exercise) => {
    onChange(exercise);
    setIsOpen(false);
    setSearchTerm('');
  };

  const currentExercise = exerciseDatabase.find((ex: Exercise) => ex.name === value);

  return (
    <div className="relative">
      <div
        className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={currentExercise ? 'text-gray-900' : 'text-gray-500'}>
          {currentExercise ? currentExercise.name : 'Select exercise...'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {Object.entries(groupedExercises).map(([category, exercises]) => (
              <div key={category}>
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">{category}</h4>
                </div>
                {(exercises as Exercise[]).map((exercise: Exercise) => (
                  <div
                    key={exercise.name}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelect(exercise)}
                  >
                    <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
                    <div className="text-xs text-gray-500">
                      Primary: {exercise.primaryMuscle}
                      {exercise.secondaryMuscle && ` • Secondary: ${exercise.secondaryMuscle}`}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// PillBar component for set visualization
const PillBar = ({ count, max = 20 }: { count: number; max?: number }) => {
  return (
    <div className="flex gap-1 mt-1 mb-2">
      {Array.from({ length: max }).map((_, i) => {
        let color = '';
        let base = '';
        if (i < 5) { color = 'bg-blue-500 border-blue-500'; base = 'bg-blue-500'; }
        else if (i < 11) { color = 'bg-green-500 border-green-500'; base = 'bg-green-500'; }
        else { color = 'bg-yellow-400 border-yellow-400'; base = 'bg-yellow-400'; }
        return (
          <span
            key={i}
            className={`flex grow h-3 rounded-sm transition-colors
              ${i < count ? color : `${base} opacity-10 border border-gray-300`}`}
            title={String(i + 1)}
          />
        );
      })}
    </div>
  );
};

// --- SCORING FUNCTION ---
/**
 * Evaluates a training plan and returns a score and letter grade.
 * @param plan - The training plan JSON (array of days with exercises)
 * @param experience - User's experience level ("Beginner", "Intermediate", "Advanced")
 * @param focusAreas - Array of focus area muscle groups
 * @returns { score: number, grade: string, details: string[] }
 */

const TrainingPlanBuilder = () => {
  const [experience, setExperience] = useState('Intermediate');
  const [focusAreas, setFocusAreas] = useState(['Back', 'Glutes']);
  const [trainingDays, setTrainingDays] = useState(3);
  const [days, setDays] = useState<Day[]>([
    { name: 'Day 1', exercises: [] },
    { name: 'Day 2', exercises: [] },
    { name: 'Day 3', exercises: [] }
  ]);

  const muscleGroups = [
    'Chest', 'Back', 'Quads', 'Hamstrings', 'Glutes', 
    'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs'
  ];

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

  // Sample plans
  const samplePlans: Record<string, Day[]> = {
    '3-Day Sample Plan': [
      {
        name: 'Day 1',
        exercises: [
          { name: 'Barbell Bench Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest', sets: 4 },
          { name: 'Incline Dumbbell Press', primaryMuscle: 'Chest', secondaryMuscle: 'Shoulders', category: 'Chest', sets: 3 },
          { name: 'Dumbbell Row', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 4 },
          { name: 'Lat Pulldown', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 3 },
          { name: 'Overhead Barbell Press', primaryMuscle: 'Shoulders', secondaryMuscle: 'Triceps', category: 'Shoulders', sets: 3 },
          { name: 'Barbell Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps', sets: 3 }
        ]
      },
      {
        name: 'Day 2',
        exercises: [
          { name: 'Back Squat', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads', sets: 4 },
          { name: 'Romanian Deadlift', primaryMuscle: 'Hamstrings', secondaryMuscle: 'Glutes', category: 'Hamstrings', sets: 4 },
          { name: 'Bulgarian Split Squat', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads', sets: 3 },
          { name: 'Hip Thrust', primaryMuscle: 'Glutes', secondaryMuscle: 'Hamstrings', category: 'Glutes', sets: 3 },
          { name: 'Standing Calf Raise', primaryMuscle: 'Calves', secondaryMuscle: '', category: 'Calves', sets: 4 },
          { name: 'Plank', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs', sets: 3 }
        ]
      },
      {
        name: 'Day 3',
        exercises: [
          { name: 'Pull-Up', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 4 },
          { name: 'Dumbbell Bench Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest', sets: 3 },
          { name: 'Dumbbell Shoulder Press', primaryMuscle: 'Shoulders', secondaryMuscle: 'Triceps', category: 'Shoulders', sets: 3 },
          { name: 'Lateral Raise', primaryMuscle: 'Shoulders', secondaryMuscle: '', category: 'Shoulders', sets: 3 },
          { name: 'Tricep Pushdown', primaryMuscle: 'Triceps', secondaryMuscle: '', category: 'Triceps', sets: 3 },
          { name: 'Hammer Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps', sets: 3 },
          { name: 'Russian Twist', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs', sets: 3 }
        ]
      }
    ],
    '4-Day Sample Plan': [
      {
        name: 'Day 1',
        exercises: [
          { name: 'Barbell Bench Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest', sets: 4 },
          { name: 'Incline Dumbbell Press', primaryMuscle: 'Chest', secondaryMuscle: 'Shoulders', category: 'Chest', sets: 3 },
          { name: 'Barbell Curl', primaryMuscle: 'Biceps', secondaryMuscle: '', category: 'Biceps', sets: 3 }
        ]
      },
      {
        name: 'Day 2',
        exercises: [
          { name: 'Back Squat', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads', sets: 4 },
          { name: 'Leg Press', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads', sets: 3 },
          { name: 'Standing Calf Raise', primaryMuscle: 'Calves', secondaryMuscle: '', category: 'Calves', sets: 4 }
        ]
      },
      {
        name: 'Day 3',
        exercises: [
          { name: 'Pull-Up', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 4 },
          { name: 'Dumbbell Row', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 3 },
          { name: 'Lat Pulldown', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 3 }
        ]
      },
      {
        name: 'Day 4',
        exercises: [
          { name: 'Overhead Barbell Press', primaryMuscle: 'Shoulders', secondaryMuscle: 'Triceps', category: 'Shoulders', sets: 4 },
          { name: 'Lateral Raise', primaryMuscle: 'Shoulders', secondaryMuscle: '', category: 'Shoulders', sets: 3 },
          { name: 'Plank', primaryMuscle: 'Abs', secondaryMuscle: '', category: 'Abs', sets: 3 }
        ]
      }
    ],
    '5-Day Sample Plan': [
      {
        name: 'Day 1',
        exercises: [
          { name: 'Barbell Bench Press', primaryMuscle: 'Chest', secondaryMuscle: 'Triceps', category: 'Chest', sets: 4 },
          { name: 'Incline Dumbbell Press', primaryMuscle: 'Chest', secondaryMuscle: 'Shoulders', category: 'Chest', sets: 3 }
        ]
      },
      {
        name: 'Day 2',
        exercises: [
          { name: 'Back Squat', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads', sets: 4 },
          { name: 'Leg Press', primaryMuscle: 'Quads', secondaryMuscle: 'Glutes', category: 'Quads', sets: 3 }
        ]
      },
      {
        name: 'Day 3',
        exercises: [
          { name: 'Pull-Up', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 4 },
          { name: 'Dumbbell Row', primaryMuscle: 'Back', secondaryMuscle: 'Biceps', category: 'Back', sets: 3 }
        ]
      },
      {
        name: 'Day 4',
        exercises: [
          { name: 'Overhead Barbell Press', primaryMuscle: 'Shoulders', secondaryMuscle: 'Triceps', category: 'Shoulders', sets: 4 },
          { name: 'Lateral Raise', primaryMuscle: 'Shoulders', secondaryMuscle: '', category: 'Shoulders', sets: 3 }
        ]
      },
      {
        name: 'Day 5',
        exercises: [
          { name: 'Romanian Deadlift', primaryMuscle: 'Hamstrings', secondaryMuscle: 'Glutes', category: 'Hamstrings', sets: 4 },
          { name: 'Standing Calf Raise', primaryMuscle: 'Calves', secondaryMuscle: '', category: 'Calves', sets: 3 }
        ]
      }
    ]
  };

  const handleSamplePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (samplePlans[selected]) {
      setTrainingDays(samplePlans[selected].length);
      setDays(samplePlans[selected]);
      // Optionally set experience/focus areas for each plan
      if (selected === '3-Day Sample Plan') {
        setExperience('Intermediate');
        setFocusAreas(['Back', 'Chest', 'Shoulders']);
      } else if (selected === '4-Day Sample Plan') {
        setExperience('Intermediate');
        setFocusAreas(['Quads', 'Back', 'Shoulders']);
      } else if (selected === '5-Day Sample Plan') {
        setExperience('Advanced');
        setFocusAreas(['Chest', 'Back', 'Quads', 'Shoulders']);
      }
    }
  };

  // Update days array when training days changes
  useEffect(() => {
    const newDays = Array.from({ length: trainingDays }, (_, i) => ({
      name: `Day ${i + 1}`,
      exercises: days[i]?.exercises || []
    }));
    setDays(newDays);
  }, [trainingDays]);

  const addExercise = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.push({
      name: 'Barbell Bench Press',
      sets: 3,
      primaryMuscle: 'Chest',
      secondaryMuscle: 'Triceps',
      category: 'Chest'
    });
    setDays(newDays);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(newDays);
  };

  const updateExercise = (dayIndex: number, exerciseIndex: number, field: string, value: Exercise | number) => {
    const newDays = [...days];
    if (field === 'exercise' && typeof value === 'object') {
      newDays[dayIndex].exercises[exerciseIndex].name = value.name;
      newDays[dayIndex].exercises[exerciseIndex].primaryMuscle = value.primaryMuscle;
      newDays[dayIndex].exercises[exerciseIndex].secondaryMuscle = value.secondaryMuscle;
    } else if (field === 'sets' && typeof value === 'number') {
      newDays[dayIndex].exercises[exerciseIndex].sets = value;
    }
    setDays(newDays);
  };

  const handleFocusAreaChange = (muscle: string) => {
    setFocusAreas(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  // Analysis calculations
  const getVolumeAndFrequency = () => {
    const volumeMap: Record<string, number> = {};
    const frequencyMap: Record<string, number> = {};
    
    muscleGroups.forEach(muscle => {
      volumeMap[muscle] = 0;
      frequencyMap[muscle] = 0;
    });

    days.forEach(day => {
      const trainedMuscles = new Set<string>();
      
      day.exercises.forEach(exercise => {
        if (exercise.primaryMuscle) {
          volumeMap[exercise.primaryMuscle] += exercise.sets || 0;
          trainedMuscles.add(exercise.primaryMuscle);
        }
        if (exercise.secondaryMuscle) {
          volumeMap[exercise.secondaryMuscle] += Math.floor((exercise.sets || 0));
          trainedMuscles.add(exercise.secondaryMuscle);
        }
      });

      trainedMuscles.forEach((muscle: string) => {
        frequencyMap[muscle] += 1;
      });
    });

    return { volumeMap, frequencyMap };
  };

  const { volumeMap, frequencyMap } = getVolumeAndFrequency();

  const getTotalSets = () => {
    return days.reduce((total, day) => 
      total + day.exercises.reduce((dayTotal, exercise) => 
        dayTotal + (exercise.sets || 0), 0), 0);
  };
  const getTotalExercises = () => {
    return days.reduce((total, day) => total + day.exercises.length, 0);
  };

  const getVolumeRecommendation = (sets: number) => {
    if (sets < 5) return { text: 'Low for hypertrophy — may support maintenance', color: 'text-blue-600 bg-blue-50' };
    if (sets < 12) return { text: 'Good for hypertrophy', color: 'text-green-600 bg-green-50' };
    if (sets <= 20) return { text: 'Optimal range for hypertrophy', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'High — ensure recovery is managed', color: 'text-red-600 bg-red-50' };
  };

  const getFocusAreaFeedback = () => {
    const feedback: FeedbackItem[] = [];
    
    focusAreas.forEach(muscle => {
      const volume = volumeMap[muscle] || 0;
      const frequency = frequencyMap[muscle] || 0;
      
      if (volume < 12 || frequency < 2) {
        feedback.push({
          muscle,
          message: `Consider increasing ${muscle} volume or frequency`,
          type: 'warning'
        });
      }
    });

    days.forEach((day) => {
      const dayTotal = day.exercises.reduce((total, ex) => total + (ex.sets || 0), 0);
      if (dayTotal > 20) {
        feedback.push({
          muscle: day.name,
          message: 'High volume day — consider splitting across the week',
          type: 'info'
        });
      }
    });

    return feedback;
  };

  const totalSets = getTotalSets();
  const totalTime = totalSets * 3;
  const totalExercises = getTotalExercises();
  const feedback = getFocusAreaFeedback();

  // Weekly set recommendation based on experience
  const getWeeklySetRecommendation = (sets: number, experience: string) => {
    let min = 0, max = 0;
    if (experience === 'Beginner') { min = 50; max = 70; }
    else if (experience === 'Intermediate') { min = 70; max = 110; }
    else if (experience === 'Advanced') { min = 100; max = 140; }

    if (sets < min) return { text: `Low number of sets for your experience level (${min}-${max} sets recommended)`, color: 'text-blue-600 bg-blue-50' };
    if (sets > max) return { text: `High number of sets — ensure recovery is managed (${min}-${max} sets recommended)`, color: 'text-red-600 bg-red-50' };
    return { text: `Optimal set range for your experience level (${min}-${max} sets)`, color: 'text-green-600 bg-green-50' };
  };
  const weeklySetRecommendation = getWeeklySetRecommendation(totalSets, experience);

  // Helper: Map muscle group to exercises and days
  const getMuscleExerciseMap = () => {
    const map: Record<string, { name: string; day: string }[]> = {};
    muscleGroups.forEach(muscle => { map[muscle] = []; });
    days.forEach(day => {
      day.exercises.forEach(ex => {
        if (
          ex.primaryMuscle &&
          muscleGroups.map(m => m.toLowerCase()).includes(ex.primaryMuscle.toLowerCase())
        ) {
          // Find the canonical muscle group name
          const canonical = muscleGroups.find(m => m.toLowerCase() === ex.primaryMuscle.toLowerCase())!;
          map[canonical].push({ name: ex.name, day: day.name });
        }
        if (
          ex.secondaryMuscle &&
          muscleGroups.map(m => m.toLowerCase()).includes(ex.secondaryMuscle.toLowerCase())
        ) {
          const canonical = muscleGroups.find(m => m.toLowerCase() === ex.secondaryMuscle.toLowerCase())!;
          map[canonical].push({ name: ex.name, day: day.name });
        }
      });
    });
    return map;
  };
  const muscleExerciseMap = getMuscleExerciseMap();

  const score = scoreTrainingPlan(days, experience, focusAreas);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Weekly Training Plan Builder
        </h1>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Panel - Plan Builder */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Plan Builder
            </h2>
            
            {/* Setup Form */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Days per Week
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="7" 
                    value={trainingDays}
                    onChange={(e) => setTrainingDays(parseInt(e.target.value) || 3)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map(muscle => (
                    <button
                      key={muscle}
                      onClick={() => handleFocusAreaChange(muscle)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        focusAreas.includes(muscle)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {muscle}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <select
                  defaultValue=""
                  onChange={handleSamplePlanChange}
                  className="w-1/2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  <option value="" disabled>Load Example Plan</option>
                  <option value="3-Day Sample Plan">3-Day Sample Plan</option>
                  <option value="4-Day Sample Plan">4-Day Sample Plan</option>
                  <option value="5-Day Sample Plan">5-Day Sample Plan</option>
                </select>
                <button
                  onClick={() => {
                    setDays(days.map(day => ({ ...day, exercises: [] })));
                  }}
                  className="w-1/2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Reset Plan
                </button>
              </div>
            </div>

            {/* Training Days */}
            <div className="space-y-6">
              {days.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{day.name}</h3>
                    {/* Day Summary */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600">
                            <strong>Exercises:</strong> {day.exercises.length}
                        </span>
                        <span className="text-gray-600">
                            <strong>Sets:</strong> {day.exercises.reduce((total, ex) => total + (ex.sets || 0), 0)}
                        </span>
                        <span className="text-gray-600 flex items-center">
                            <strong>Time:</strong> {day.exercises.reduce((total, ex) => total + (ex.sets || 0), 0) * 3} min
                        </span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:col-span-2">
                          <ExerciseSelector
                            value={exercise.name}
                            onChange={(selectedExercise) => updateExercise(dayIndex, exerciseIndex, 'exercise', selectedExercise)}
                          />
                          <div className="mt-1 text-xs text-gray-500">
                            Primary: {exercise.primaryMuscle}
                            {exercise.secondaryMuscle && ` • Secondary: ${exercise.secondaryMuscle}`}
                          </div>
                        </div>
                        
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'sets', parseInt(e.target.value) || 0)}
                          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Sets"
                        />
                        
                        <button
                          onClick={() => removeExercise(dayIndex, exerciseIndex)}
                          className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addExercise(dayIndex)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Exercise
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Analysis */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Real-Time Analysis
            </h2>

            {/* Training Plan Score */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Training Plan Score</h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center flex flex-col grow">
                  <div className="text-2xl font-bold text-purple-600">{score.score}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center flex flex-col grow">
                  <div className="text-2xl font-bold text-gray-900">{score.grade}</div>
                  <div className="text-sm text-gray-600">Grade</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700">
                <strong>Details:</strong>
                <ul className="list-disc list-inside mt-2">
                  {score.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Weekly Summary */}
            {/* <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Weekly Summary</h3>
              <div className="flex row gap-4">
                <div className="text-center flex flex-col grow">
                  <div className="text-2xl font-bold text-blue-600">{totalSets}</div>
                  <div className="text-sm text-gray-600">Total Sets</div>
                </div>
                <div className="text-center flex flex-col grow">
                  <div className="text-2xl font-bold text-purple-600">{totalExercises}</div>
                  <div className="text-sm text-gray-600">Exercises</div>
                </div>
                <div className="text-center flex flex-col grow">
                  <div className="text-2xl font-bold text-green-600">{totalTime}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
              </div>
              <div className={`mt-4 text-center text-sm px-4 py-3 rounded-md font-medium ${weeklySetRecommendation.color}`}>
                {weeklySetRecommendation.text}
              </div>
            </div> */}

            {/* Volume & Frequency Analysis */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Volume & Frequency Analysis</h3>
              <div className="space-y-3">
                {muscleGroups.map(muscle => {
                  const volume = volumeMap[muscle] || 0;
                  const frequency = frequencyMap[muscle] || 0;
                  const recommendation = getVolumeRecommendation(volume);
                  const exercises = muscleExerciseMap[muscle];
                  
                  if (volume === 0 && frequency === 0) return null;
                  
                  return (
                    <div key={muscle} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{muscle}</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {volume} sets • {frequency}x/week
                          </div>
                        </div>
                      </div>
                      {/* PillBar visualization for sets */}
                      <PillBar count={Math.min(volume, 20)} max={20} />
                      {/* List exercises and days for this muscle group */}
                      {exercises && exercises.length > 0 && (
                        <div className="text-xs text-gray-500 mb-2">
                          {exercises.map((ex) => `${ex.name} (${ex.day})`).join(', ')}
                        </div>
                      )}
                      <div className={`text-xs px-4 py-3 rounded-md ${recommendation.color}`}>
                        {recommendation.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            {feedback.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {feedback.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg text-sm ${
                        item.type === 'warning' 
                          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      <strong>{item.muscle}:</strong> {item.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlanBuilder;