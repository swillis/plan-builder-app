import React, { useState } from 'react';
import { Menu, X, Plus, LogOut, BookOpen, Loader2, MoreVertical } from 'lucide-react';

const Sidebar: React.FC<{
  plans: { id: string; name: string }[];
  loading?: boolean;
  onNewPlan?: () => void;
  onSelectPlan?: (id: string) => void;
  onSignOut?: () => void;
  onRenamePlan?: (id: string) => void;
  onDeletePlan?: (id: string) => void;
}> = ({ plans, loading, onNewPlan, onSelectPlan, onSignOut, onRenamePlan, onDeletePlan }) => {
  const [open, setOpen] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  return (
    <div className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ${open ? 'w-64' : 'w-16'} bg-white shadow-lg flex flex-col`}>
      {/* Collapse/Expand Button */}
      <button
        className="absolute top-4 right-[-18px] bg-white border border-gray-200 rounded-full shadow p-1 z-40 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-6 border-b border-gray-200">
          <BookOpen className="h-7 w-7 text-blue-600" />
          {open && <span className="text-xl font-bold text-gray-900">Plans</span>}
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            onClick={onNewPlan}
          >
            <Plus className="h-4 w-4" />
            {open && 'New Plan'}
          </button>
          <div className="space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-blue-400" />
              </div>
            ) : plans.length === 0 ? (
              <div className="text-gray-400 text-sm px-3 py-2">No saved plans</div>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative group"
                >
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-blue-50 text-gray-800 transition-colors pr-8"
                    onClick={() => onSelectPlan && onSelectPlan(plan.id)}
                  >
                    <BookOpen className="h-4 w-4 text-blue-400" />
                    {open && plan.name}
                  </button>
                  {/* More (3 dots) icon, visible on hover */}
                  {open && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200"
                      onClick={e => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === plan.id ? null : plan.id);
                      }}
                      tabIndex={-1}
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                  {/* Dropdown menu */}
                  {menuOpenId === plan.id && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[120px]">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setMenuOpenId(null);
                          if (onRenamePlan) onRenamePlan(plan.id);
                        }}
                      >
                        Rename
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setMenuOpenId(null);
                          if (onDeletePlan) onDeletePlan(plan.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-red-50 text-red-600 transition-colors font-medium"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4" />
            {open && 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 