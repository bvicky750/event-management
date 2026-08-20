import React, { useState } from 'react';
import { mockStudentsList } from '../../data/users';
import { GraduationCap, Search, Mail, Phone, Building2, UserCheck, BookOpen, Filter } from 'lucide-react';
import { SearchBar } from '../../components/common/SearchBar';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const StaffStudentsPage = () => {
  const [query, setQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const departments = [
    'ALL',
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication',
    'Artificial Intelligence and Data Science',
    'Mechanical Engineering',
    'Electrical and Electronics'
  ];

  const filtered = mockStudentsList.filter(s => {
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(query.toLowerCase()) ||
      s.department.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;

    return matchesQuery && matchesDept;
  });

  const columns = [
    { header: "Student Name" },
    { header: "Register Number" },
    { header: "Department" },
    { header: "Year of Study" },
    { header: "College Email" },
    { header: "Contact" },
    { header: "OD Eligibility" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Accounts Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Accounts Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search and verify enrolled students for event participation, team approvals, and On-Duty (OD) eligibility.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-brand-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{mockStudentsList.length * 150}+</p>
          <p className="text-[11px] text-slate-500">Active student records</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">OD Eligible</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
          <p className="text-[11px] text-slate-500">Verified institutional status</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Departments</span>
          <p className="text-2xl font-black text-purple-600 mt-1">6</p>
          <p className="text-[11px] text-slate-500">Engineering disciplines</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-600">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Academic Year</span>
          <p className="text-2xl font-black text-amber-600 mt-1">2026-2027</p>
          <p className="text-[11px] text-slate-500">OD guidelines in effect</p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search by student name, register number (e.g. 23CSE001), or email..."
          />
        </div>
        <div className="sm:w-64">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="ALL">All Departments</option>
            {departments.filter(d => d !== 'ALL').map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          data={filtered}
          renderRow={(s) => (
            <tr key={s.id} className="hover:bg-slate-50/80 transition text-xs">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{s.name}</span>
                    <span className="text-[10px] text-slate-400">{s.phone}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 font-mono text-brand-700 font-semibold whitespace-nowrap">
                {s.registerNumber}
              </td>
              <td className="px-4 py-3.5 text-slate-600">{s.department}</td>
              <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">{s.year}</td>
              <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{s.email}</td>
              <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{s.phone}</td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant="success" size="sm">Active & Eligible</Badge>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};
