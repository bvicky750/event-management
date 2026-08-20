import React from 'react';

export const Table = ({
  columns = [],
  data = [],
  renderRow,
  emptyMessage = "No records found.",
  className = ""
}) => {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (renderRow ? renderRow(item, idx) : null))
          )}
        </tbody>
      </table>
    </div>
  );
};
