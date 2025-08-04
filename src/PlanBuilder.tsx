import { useState, useEffect, useRef } from 'react';
import { Plus, X, Target, TrendingUp, ChevronDown, Search, GripVertical } from 'lucide-react';
import { scoreTrainingPlan } from './planScoring';
import { exerciseDatabase } from './exerciseDatabase';
import type { Exercise } from './exerciseDatabase';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; // Make sure you export auth from firebase.ts
import { PanelLeft } from 'lucide-react';
// Example plan keys for copy button logic
const EXAMPLE_PLAN_KEYS = [
  '3-Day Sample Plan',
  '4-Day Sample Plan',
  '5-Day Sample Plan',
];

export interface Day {
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

interface TrainingPlanBuilderProps {
  days?: Day[];
  experience?: string;
  focusAreas?: string[];
  trainingDays?: number;
  onPlanLoaded?: () => void;
  onOpenSidebar?: () => void;
  planId?: string;
  planNameProp?: string;
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

const TrainingPlanBuilder = ({ days: initialDays, experience: initialExperience, focusAreas: initialFocusAreas, trainingDays: initialTrainingDays, onPlanLoaded, onOpenSidebar, planId, planNameProp }: TrainingPlanBuilderProps = {}) => {
  const [user] = useAuthState(auth);
  const [experience, setExperience] = useState(initialExperience || 'Intermediate');
  const [focusAreas, setFocusAreas] = useState(initialFocusAreas || []);
  const [trainingDays, setTrainingDays] = useState(initialTrainingDays || 3);
  const [days, setDays] = useState<Day[]>(
    initialDays || [
      { name: 'Day 1', exercises: [] },
      { name: 'Day 2', exercises: [] },
      { name: 'Day 3', exercises: [] }
    ]
  );
  const [planName, setPlanName] = useState<string>(planNameProp || "New Plan");

  const initialPlanRef = useRef({
    days: initialDays,
    experience: initialExperience,
    focusAreas: initialFocusAreas,
    trainingDays: initialTrainingDays,
    planName: planNameProp || "New Plan"
  });

  // Detect if this is an example plan (no planId, planNameProp matches example key)
  const isExamplePlan = !planId && planNameProp && EXAMPLE_PLAN_KEYS.includes(planNameProp);

  // Sync state with props if they change
  useEffect(() => {
    if (initialDays) setDays(initialDays);
    if (initialExperience) setExperience(initialExperience);
    if (initialFocusAreas) setFocusAreas(initialFocusAreas);
    if (initialTrainingDays) setTrainingDays(initialTrainingDays);
    setPlanName(planNameProp || "New Plan");
    initialPlanRef.current = {
      days: initialDays,
      experience: initialExperience,
      focusAreas: initialFocusAreas,
      trainingDays: initialTrainingDays,
      planName: planNameProp || "New Plan"
    };
    if (onPlanLoaded) onPlanLoaded();
    // eslint-disable-next-line
  }, [initialDays, initialExperience, initialFocusAreas, initialTrainingDays, planNameProp]);

  // Detect mobile (tailwind md: breakpoint)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const muscleGroups = [
    'Chest', 'Back', 'Quads', 'Hamstrings', 'Glutes', 
    'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs'
  ];

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

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
      category: 'Chest',
      equipment: 'Barbell',
      movementType: 'Compound',
      mechanics: 'Push'
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
      // Only allow valid numbers between 1 and 10
      if (Number.isFinite(value) && value >= 1 && value <= 10) {
        newDays[dayIndex].exercises[exerciseIndex].sets = value;
        setDays(newDays);
      }
      // If invalid, do not update state
      return;
    }
    if (field === 'exercise') setDays(newDays);
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
      });

      trainedMuscles.forEach((muscle: string) => {
        frequencyMap[muscle] += 1;
      });
    });

    return { volumeMap, frequencyMap };
  };

  const { volumeMap, frequencyMap } = getVolumeAndFrequency();

  // Removed unused getTotalSets and getTotalExercises

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

  // Removed unused totalSets
  const feedback = getFocusAreaFeedback();

  // Removed unused getWeeklySetRecommendation

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

      });
    });
    return map;
  };
  const muscleExerciseMap = getMuscleExerciseMap();

  const score = scoreTrainingPlan(days, experience, focusAreas);

  const savePlan = async () => {
    if (!user) {
      alert("You must be signed in to save a plan.");
      return;
    }
    if (planId) {
      // Update existing plan
      try {
        await updateDoc(doc(db, "plans", planId), {
          name: planName,
          days,
          experience,
          focusAreas,
          trainingDays,
        });
        alert("Plan updated!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert("Error updating plan: " + e.message);
        } else {
          alert("Unknown error updating plan.");
        }
      }
    } else {
      // Create new plan
      const inputName = prompt("Enter a name for your plan:", planName === "New Plan" ? "" : planName);
      if (!inputName) return;
      try {
        await addDoc(collection(db, "plans"), {
          name: inputName,
          days,
          experience,
          focusAreas,
          trainingDays,
          createdAt: new Date().toISOString(),
          userId: user.uid,
        });
        setPlanName(inputName);
        alert("Plan saved to Firestore!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert("Error saving plan: " + e.message);
        } else {
          alert("Unknown error saving plan.");
        }
      }
    }
  };

  // --- DRAG AND DROP HANDLER ---
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    // If dropped in the same place, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const sourceDayIdx = parseInt(source.droppableId.replace('day-', ''));
    const destDayIdx = parseInt(destination.droppableId.replace('day-', ''));
    const newDays = [...days];
    // Remove from source
    const [moved] = newDays[sourceDayIdx].exercises.splice(source.index, 1);
    // Insert into destination
    newDays[destDayIdx].exercises.splice(destination.index, 0, moved);
    setDays(newDays);
  };

  // Calculate total number of exercises across all days
  const totalExercises = days.reduce((sum, day) => sum + day.exercises.length, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto">
        {/* Header with Plan Name and Save/Copy Button */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <div className="flex items-center">
            {/* Sidebar open icon (show if onOpenSidebar is provided and on mobile) */}
            {onOpenSidebar && isMobile && (
              <button
                className="mr-2 p-2 rounded hover:bg-gray-100"
                onClick={onOpenSidebar}
                aria-label="Open sidebar"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="font-medium text-lg text-gray-900">
              {planName}
            </h1>
          </div>
          <button
            onClick={savePlan}
            className="bg-blue-600 text-white py-2 px-3 text-sm rounded-md font-medium transition-colors hover:bg-blue-700"
          >
            {isExamplePlan ? 'Copy to My Plans' : 'Save Plan'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2">
          {/* Left Panel - Plan Builder */}
          <div className="bg-white p-6 border-r border-gray-200">
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
            </div>

            {/* Training Days */}
            <DragDropContext onDragEnd={onDragEnd}>
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
                    <Droppable droppableId={`day-${dayIndex}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                        >
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <Draggable
                              key={exerciseIndex + '-' + exercise.name}
                              draggableId={`day-${dayIndex}-exercise-${exerciseIndex}`}
                              index={exerciseIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex flex-row gap-3 p-3 bg-gray-50 rounded-lg items-center ${snapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
                                >
                                  {/* Drag handle icon */}
                                  <div className="flex items-center mr-2 md:mr-0" {...provided.dragHandleProps}>
                                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                                  </div>
                                  <div className="flex flex-col grow">
                                    <ExerciseSelector
                                      value={exercise.name}
                                      onChange={(selectedExercise) => updateExercise(dayIndex, exerciseIndex, 'exercise', selectedExercise)}
                                    />
                                  </div>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={exercise.sets}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (!isNaN(val) && val >= 1 && val <= 10) {
                                        updateExercise(dayIndex, exerciseIndex, 'sets', val);
                                      }
                                    }}
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
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <button
                            onClick={() => addExercise(dayIndex)}
                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Exercise
                          </button>
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>

          {/* Right Panel - Analysis */}
          <div className="bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Real-Time Analysis
            </h2>

            {totalExercises < 3 ? (
              <div className="text-center text-gray-500 text-lg py-16">
                Select a minimum of 3 exercises to see analysis
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlanBuilder;