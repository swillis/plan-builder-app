import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import Login from "./Login";
import TrainingPlanBuilder from "./PlanBuilder";
import Sidebar from "./Sidebar";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const SIDEBAR_OPEN_WIDTH = 256; // w-64
const SIDEBAR_COLLAPSED_WIDTH = 64; // w-16

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(false);
  // Sidebar open state will be managed in Sidebar for now
  const sidebarOpen = true;

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
      });
    }
    setPlanLoading(false);
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

  return loading ? (
    <div className="min-h-screen flex items-center justify-center">Loading...</div>
  ) : !user ? (
    <Login />
  ) : (
    <div className="relative min-h-screen bg-gray-50">
      <Sidebar
        plans={plans}
        loading={plansLoading}
        onNewPlan={handleNewPlan}
        onSelectPlan={handleSelectPlan}
        onSignOut={handleSignOut}
        onRenamePlan={handleRenamePlan}
        onDeletePlan={handleDeletePlan}
      />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
      >
        {planLoading ? (
          <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading plan...</div>
        ) : (
          <TrainingPlanBuilder
            days={selectedPlan?.days}
            experience={selectedPlan?.experience}
            focusAreas={selectedPlan?.focusAreas}
            trainingDays={selectedPlan?.trainingDays}
          />
        )}
      </div>
    </div>
  );
};

export default App;
