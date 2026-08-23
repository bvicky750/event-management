import React from 'react';
import { CheckCircle2, Circle, Users, Sparkles, Tag } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ActivityList = ({
  activities = [],
  selectedActivities = [],
  onToggleActivity,
  selectable = false,
  className = ""
}) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-200">
        No specific activities listed for this event.
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {activities.map((act) => {
        const isSelected = selectedActivities.includes(act.name);

        return (
          <div
            key={act.id || act.name}
            onClick={() => selectable && onToggleActivity && onToggleActivity(act.name)}
            className={`p-4 rounded-xl border transition-all ${
              selectable ? 'cursor-pointer hover:border-brand-400 hover:shadow-xs' : ''
            } ${
              isSelected
                ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/20'
                : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {selectable && (
                  <div className="mt-0.5 text-brand-600 flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 fill-brand-600 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{act.name}</h4>
                    {act.type && (
                      <Badge variant="default" size="sm">
                        {act.type}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{act.description}</p>
                </div>
              </div>

              {/* Fee & Capacity */}
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                  {act.fee === 0 ? 'Free' : `₹${act.fee}`}
                </span>
                {act.capacity && (
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-0.5">
                    <Users className="w-3 h-3" />
                    <span>{act.capacity} seats</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
