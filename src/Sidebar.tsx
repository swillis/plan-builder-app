import React, { useEffect, useRef } from 'react';
import { PanelLeft, Plus, LogOut, Loader2, MoreVertical, ChevronDown } from 'lucide-react';

const Sidebar: React.FC<{
  plans: { id: string; name: string }[];
  examplePlans: { key: string; name: string }[];
  loading?: boolean;
  onNewPlan?: () => void;
  onSelectPlan?: (id: string) => void;
  onSelectExamplePlan?: (key: string) => void;
  onSignOut?: () => void;
  onRenamePlan?: (id: string) => void;
  onDeletePlan?: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
}> = ({ plans, examplePlans, loading, onNewPlan, onSelectPlan, onSelectExamplePlan, onSignOut, onRenamePlan, onDeletePlan, open, setOpen, isMobile }) => {
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
  const [showExamples, setShowExamples] = React.useState(true);
  const [showMyPlans, setShowMyPlans] = React.useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside (on mobile)
  useEffect(() => {
    if (!isMobile || !open) return;
    const handleClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMobile, open, setOpen]);

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar (always rendered, slides in/out on both desktop and mobile) */}
      <div
        ref={sidebarRef}
        className={`z-50 bg-white flex flex-col border-r border-gray-200 transition-all duration-300
          ${isMobile
            ? `fixed top-0 left-0 h-full md:hidden w-64 ${open ? 'translate-x-0' : '-translate-x-full'}`
            : `relative h-full ${open ? 'w-64' : 'w-16'} ${open ? 'translate-x-0' : ''}`
          }
        `}
        style={{ transitionProperty: 'width, transform' }}
      >
        <div className="flex items-center gap-2 px-6 h-20 border-b border-gray-200">
          <button
            className="p-1 hover:bg-gray-100 rounded-md transition-colors mr-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          {open && <span className="text-xl font-bold text-gray-900">SetScout</span>}
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            onClick={onNewPlan}
          >
            <Plus className="h-4 w-4" />
            {open && 'New Plan'}
          </button>
          {/* Example Plans Section - only show when open */}
          {open && (
            <div className="mb-4">
              <button
                className="flex items-center w-full px-2 py-2 text-gray-700 font-semibold text-sm hover:bg-gray-100 rounded transition-colors"
                onClick={() => setShowExamples((v) => !v)}
              >
                <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showExamples ? '' : '-rotate-90'}`} />
                {'Example Plans'}
              </button>
              {showExamples && (
                <div className="pl-6 mt-1 space-y-1">
                  {examplePlans.length === 0 ? (
                    <div className="text-gray-400 text-xs px-2 py-1">No example plans</div>
                  ) : (
                    examplePlans.map((plan) => (
                      <button
                        key={plan.key}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-gray-800 text-sm transition-colors"
                        onClick={() => onSelectExamplePlan && onSelectExamplePlan(plan.key)}
                      >
                        {plan.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {/* My Plans Section - only show when open */}
          {open && (
            <div>
              <button
                className="flex items-center w-full px-2 py-2 text-gray-700 font-semibold text-sm hover:bg-gray-100 rounded transition-colors"
                onClick={() => setShowMyPlans((v) => !v)}
              >
                <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showMyPlans ? '' : '-rotate-90'}`} />
                {'My Plans'}
              </button>
              {showMyPlans && (
                <div className="pl-6 mt-1 space-y-1">
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
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-gray-800 text-sm transition-colors pr-8"
                          onClick={() => onSelectPlan && onSelectPlan(plan.id)}
                        >
                          {plan.name}
                        </button>
                        {/* More (3 dots) icon, visible on hover */}
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
              )}
            </div>
          )}
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
    </>
  );
};

export default Sidebar; 