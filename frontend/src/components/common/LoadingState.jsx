import React from 'react';

export const LoadingState = ({ message = "Loading content...", rows = 3 }) => {
  return (
    <div className="w-full space-y-4 py-8">
      <div className="flex items-center justify-center gap-3 text-sm text-slate-500 mb-6">
        <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <span>{message}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 w-full rounded-xl bg-slate-200/60 animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export const EventCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs animate-pulse">
    <div className="h-44 w-full bg-slate-200 rounded-xl mb-4" />
    <div className="h-4 w-1/3 bg-slate-200 rounded mb-2" />
    <div className="h-6 w-3/4 bg-slate-200 rounded mb-4" />
    <div className="space-y-2 mb-4">
      <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
      <div className="h-3.5 w-2/3 bg-slate-200 rounded" />
    </div>
    <div className="h-10 w-full bg-slate-200 rounded-xl" />
  </div>
);
