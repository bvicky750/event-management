import React, { useState } from 'react';
import { mockStaffList } from '../../data/users';
import { Users, Briefcase, Mail, Building2, Phone, Calendar, Search } from 'lucide-react';
import { SearchBar } from '../../components/common/SearchBar';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const StaffFacultyPage = () => {
  const [query, setQuery] = useState('');

  const filtered = mockStaffList.filter(st =>
    st.name.toLowerCase().includes(query.toLowerCase()) ||
    st.department.toLowerCase().includes(query.toLowerCase()) ||
    st.employeeId.toLowerCase().includes(query.toLowerCase()) ||
    st.designation.toLowerCase().includes(query.toLowerCase())
  );

  const columns = [
    { header: "Faculty Name" },
    { header: "Employee ID" },
    { header: "Department" },
    { header: "Designation" },
    { header: "Official Email" },
    { header: "Active Managed Events" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Faculty & Convener Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Faculty & Convener Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of departmental faculty conveners, event coordinators, and academic reviewers across institutions.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-amber-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Authorized Conveners</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{mockStaffList.length}</p>
          <p className="text-[11px] text-slate-500">Active event coordinators</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-brand-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Active Events</span>
          <p className="text-2xl font-black text-brand-600 mt-1">
            {mockStaffList.reduce((acc, s) => acc + (s.activeEventsCount || 0), 0)}
          </p>
          <p className="text-[11px] text-slate-500">Symposiums & workshops</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">OD Approval Authority</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">Granted</p>
          <p className="text-[11px] text-slate-500">Department level sign-off</p>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search faculty by name, department, employee ID, or designation..."
        />
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          data={filtered}
          renderRow={(st) => (
            <tr key={st.id} className="hover:bg-slate-50/80 transition text-xs">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{st.name}</span>
                    <span className="text-[10px] text-slate-400">{st.department}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 font-mono text-amber-800 font-semibold whitespace-nowrap">
                {st.employeeId}
              </td>
              <td className="px-4 py-3.5 text-slate-600">{st.department}</td>
              <td className="px-4 py-3.5 text-slate-700 font-medium whitespace-nowrap">{st.designation}</td>
              <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{st.email}</td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-md">
                  {st.activeEventsCount || 3} Events
                </span>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};
