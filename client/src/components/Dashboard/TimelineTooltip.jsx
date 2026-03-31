import React from 'react';

const STEPS = [
  { id: 'pending', label: 'Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
];

/**
 * TimelineTooltip
 * @param {Object} props
 * @param {Array} props.statusHistory - Array of { to, changedAt, changedByRole, note }
 * @param {string} props.currentStatus - The current status of the order
 */
export default function TimelineTooltip({ statusHistory = [], currentStatus, createdAt }) {
  // Helper to find history for a specific status
  const getHistoryForStatus = (statusId) => {
    return statusHistory.find(h => h.to === statusId);
  };

  // Determine if a step is completed
  const isCompleted = (statusId) => {
    const statusIndex = STEPS.findIndex(s => s.id === statusId);
    const currentIndex = STEPS.findIndex(s => s.id === currentStatus);
    if (currentStatus === 'cancelled') return !!getHistoryForStatus(statusId);
    return statusIndex <= currentIndex;
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 z-50 w-[320px] bg-white rounded-sm shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] p-3 border border-gray-100 transition-all duration-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:translate-y-[-8px] group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto ring-1 ring-black/5">
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-1 h-2.5 bg-emerald-600 rounded-full" />
        <h4 className="text-[8px] font-black text-gray-900 uppercase tracking-widest leading-none">Order Status</h4>
      </div>
      
      <div className="relative flex items-start justify-between px-2">
        {/* Horizontal Connector Backing */}
        <div className="absolute top-[7px] left-6 right-6 h-[1px] bg-gray-100" />
        
        {STEPS.map((step, index) => {
          const history = getHistoryForStatus(step.id);
          const completed = isCompleted(step.id);
          const isLast = index === STEPS.length - 1;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
              {/* Connector Line (Progress overlay) */}
              {!isLast && completed && isCompleted(STEPS[index+1].id) && (
                <div className="absolute top-[7px] left-1/2 w-full h-[1px] bg-emerald-600 z-0" />
              )}

              {/* Dot Indicator */}
              <div 
                className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  completed 
                    ? 'bg-emerald-600 border-emerald-600 shadow-sm' 
                    : 'bg-white border-gray-200'
                }`}
              >
                {completed ? (
                  <div className="w-1 h-1 bg-white rounded-full" />
                ) : (
                  <div className="w-1 h-1 bg-gray-100 rounded-full" />
                )}
              </div>

              {/* Content below */}
              <div className="mt-2 text-center">
                <p className={`text-[10px] font-black tracking-tighter uppercase mb-0.5 ${completed ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {(history || (step.id === 'pending' && createdAt)) ? (
                    <p className="text-[8px] text-gray-400 font-bold whitespace-nowrap">
                      {new Date(history?.changedAt || createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', month: 'short'
                      })}
                    </p>
                ) : (
                  <p className="text-[8px] text-gray-200 font-bold">---</p>
                )}
              </div>

              {/* Note (if any) - Absolutely positioned to avoid pushing layout */}
              {history?.note && (
                <div className="absolute -top-6 whitespace-nowrap bg-emerald-50 text-emerald-700 text-[7px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-sm border border-emerald-100 shadow-sm transition-all duration-300">
                  {history.note}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
