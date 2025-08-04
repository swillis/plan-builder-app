import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import Login from "./Login";
import TrainingPlanBuilder from "./PlanBuilder";
import Sidebar from "./Sidebar";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import type { Day } from "./PlanBuilder";
import { exerciseDatabase } from "./exerciseDatabase";
import type { Exercise } from "./exerciseDatabase";

// Example plans (should match PlanBuilder's samplePlans)
const samplePlans: Record<string, { name: string; exercises: { name: string; sets: number }[] }[]> = {
  '3-Day Sample Plan': [
    {
      name: 'Day 1',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4 },
        { name: 'Incline Dumbbell Press', sets: 3 },
        { name: 'Dumbbell Row', sets: 4 },
        { name: 'Lat Pulldown', sets: 3 },
        { name: 'Overhead Barbell Press', sets: 3 },
        { name: 'Barbell Curl', sets: 3 }
      ]
    },
    {
      name: 'Day 2',
      exercises: [
        { name: 'Back Squat', sets: 4 },
        { name: 'Romanian Deadlift', sets: 4 },
        { name: 'Bulgarian Split Squat', sets: 3 },
        { name: 'Hip Thrust', sets: 3 },
        { name: 'Standing Calf Raise', sets: 4 },
        { name: 'Plank', sets: 3 }
      ]
    },
    {
      name: 'Day 3',
      exercises: [
        { name: 'Pull-Up', sets: 4 },
        { name: 'Dumbbell Bench Press', sets: 3 },
        { name: 'Dumbbell Shoulder Press', sets: 3 },
        { name: 'Lateral Raise', sets: 3 },
        { name: 'Tricep Pushdown', sets: 3 },
        { name: 'Hammer Curl', sets: 3 },
        { name: 'Russian Twist', sets: 3 }
      ]
    }
  ],
  '4-Day Sample Plan': [
    {
      name: 'Day 1',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4 },
        { name: 'Incline Dumbbell Press', sets: 3 },
        { name: 'Barbell Curl', sets: 3 }
      ]
    },
    {
      name: 'Day 2',
      exercises: [
        { name: 'Back Squat', sets: 4 },
        { name: 'Leg Press', sets: 3 },
        { name: 'Standing Calf Raise', sets: 4 }
      ]
    },
    {
      name: 'Day 3',
      exercises: [
        { name: 'Pull-Up', sets: 4 },
        { name: 'Dumbbell Row', sets: 3 },
        { name: 'Lat Pulldown', sets: 3 }
      ]
    },
    {
      name: 'Day 4',
      exercises: [
        { name: 'Overhead Barbell Press', sets: 4 },
        { name: 'Lateral Raise', sets: 3 },
        { name: 'Plank', sets: 3 }
      ]
    }
  ],
  '5-Day Sample Plan': [
    {
      name: 'Day 1',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4 },
        { name: 'Incline Dumbbell Press', sets: 3 }
      ]
    },
    {
      name: 'Day 2',
      exercises: [
        { name: 'Back Squat', sets: 4 },
        { name: 'Leg Press', sets: 3 }
      ]
    },
    {
      name: 'Day 3',
      exercises: [
        { name: 'Pull-Up', sets: 4 },
        { name: 'Dumbbell Row', sets: 3 }
      ]
    },
    {
      name: 'Day 4',
      exercises: [
        { name: 'Overhead Barbell Press', sets: 4 },
        { name: 'Lateral Raise', sets: 3 }
      ]
    },
    {
      name: 'Day 5',
      exercises: [
        { name: 'Romanian Deadlift', sets: 4 },
        { name: 'Standing Calf Raise', sets: 3 }
      ]
    }
  ]
};

const examplePlans = [
  { key: '3-Day Sample Plan', name: '3-Day Sample Plan' },
  { key: '4-Day Sample Plan', name: '4-Day Sample Plan' },
  { key: '5-Day Sample Plan', name: '5-Day Sample Plan' },
];

// Helper to hydrate exercises from the database
function getExerciseWithSets(name: string, sets: number): Exercise | null {
  const base = exerciseDatabase.find(ex => ex.name === name);
  return base ? { ...base, sets } : null;
}

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    days?: Day[];
    experience?: string;
    focusAreas?: string[];
    trainingDays?: number;
    id?: string;
    name?: string;
  } | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch plans for the current user
  const fetchPlans = async () => {
    if (!user) return;
    setPlansLoading(true);
    const q = query(collection(db, "plans"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    setPlans(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name || "Untitled Plan" })));
    setPlansLoading(false);
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line
  }, [user]);

  // New Plan handler (reloads the page for now, or could use a more elegant reset)
  const handleNewPlan = () => {
    setSelectedPlan(null);
  };

  // Sign out handler
  const handleSignOut = () => {
    signOut(auth);
  };

  // Load a plan by ID
  const handleSelectPlan = async (planId: string) => {
    setPlanLoading(true);
    const ref = doc(db, "plans", planId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setSelectedPlan({
        days: data.days,
        experience: data.experience,
        focusAreas: data.focusAreas,
        trainingDays: data.trainingDays,
        id: planId,
        name: data.name,
      });
    }
    setPlanLoading(false);
  };

  // Select an example plan
  const handleSelectExamplePlan = (key: string) => {
    const plan = samplePlans[key];
    if (!plan) return;
    // Set experience/focusAreas defaults as in PlanBuilder
    let experience: string | undefined;
    let focusAreas: string[] | undefined;
    if (key === '3-Day Sample Plan') {
      experience = 'Intermediate';
      focusAreas = ['Back', 'Chest', 'Shoulders'];
    } else if (key === '4-Day Sample Plan') {
      experience = 'Intermediate';
      focusAreas = ['Quads', 'Back', 'Shoulders'];
    } else if (key === '5-Day Sample Plan') {
      experience = 'Advanced';
      focusAreas = ['Chest', 'Back', 'Quads', 'Shoulders'];
    }
    // Hydrate each exercise from the database
    const hydrated = plan.map(day => ({
      name: day.name,
      exercises: day.exercises
        .map(ex => getExerciseWithSets(ex.name, ex.sets))
        .filter((ex): ex is Exercise => Boolean(ex))
    }));
    setSelectedPlan({
      days: hydrated,
      experience,
      focusAreas,
      trainingDays: hydrated.length,
      name: key,
    });
  };

  // Rename plan
  const handleRenamePlan = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    const currentName = plan?.name || "";
    const newName = prompt("Rename plan:", currentName);
    if (!newName || newName.trim() === "" || newName === currentName) return;
    await updateDoc(doc(db, "plans", planId), { name: newName });
    await fetchPlans();
    // If the renamed plan is loaded, update its name in selectedPlan
    if (selectedPlan && selectedPlan.id === planId) {
      setSelectedPlan({ ...selectedPlan, name: newName });
    }
  };

  // Delete plan
  const handleDeletePlan = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!window.confirm(`Delete plan "${plan?.name || "this plan"}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "plans", planId));
    await fetchPlans();
    // If the deleted plan is loaded, reset the builder
    if (selectedPlan && selectedPlan.id === planId) {
      setSelectedPlan(null);
    }
  };

  // Duplicate plan
  const handleDuplicatePlan = async (planId: string) => {
    if (!user) return;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    
    try {
      // Get the full plan data
      const ref = doc(db, "plans", planId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      
      const data = snap.data();
      const newName = `${data.name} (Copy)`;
      
      // Create a new plan with the same data but a new name
      await addDoc(collection(db, "plans"), {
        name: newName,
        days: data.days,
        experience: data.experience,
        focusAreas: data.focusAreas,
        trainingDays: data.trainingDays,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });
      
      await fetchPlans();
      alert(`Plan "${data.name}" duplicated as "${newName}"`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert("Error duplicating plan: " + e.message);
      } else {
        alert("Unknown error duplicating plan.");
      }
    }
  };

  return loading ? (
    <div className="min-h-screen flex items-center justify-center">Loading...</div>
  ) : !user ? (
    <Login />
  ) : (
    <div className="flex flex-row h-screen bg-gray-50">
      <Sidebar
        plans={plans}
        examplePlans={examplePlans}
        loading={plansLoading}
        onNewPlan={handleNewPlan}
        onSelectPlan={handleSelectPlan}
        onSelectExamplePlan={handleSelectExamplePlan}
        onSignOut={handleSignOut}
        onRenamePlan={handleRenamePlan}
        onDeletePlan={handleDeletePlan}
        onDuplicatePlan={handleDuplicatePlan}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isMobile={isMobile}
        selectedPlanId={selectedPlan?.id}
        selectedExamplePlanKey={selectedPlan && !selectedPlan.id ? selectedPlan.name : undefined}
      />
      <div className="flex-1 transition-all duration-300 overflow-auto">
        {planLoading ? (
          <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading plan...</div>
        ) : (
          <TrainingPlanBuilder
            days={selectedPlan?.days}
            experience={selectedPlan?.experience}
            focusAreas={selectedPlan?.focusAreas}
            trainingDays={selectedPlan?.trainingDays}
            planId={selectedPlan?.id}
            planNameProp={selectedPlan?.name}
            onOpenSidebar={!sidebarOpen ? () => setSidebarOpen(true) : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default App;
