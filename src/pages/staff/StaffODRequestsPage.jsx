import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Tabs } from '../../components/common/Tabs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Select } from '../../components/common/Select';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Textarea } from '../../components/common/Textarea';
import { EmptyState } from '../../components/common/EmptyState';

export const StaffODRequestsPage = () => {
  const { odRequests, approveOD, rejectOD } = useData();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('status')?.toLowerCase() || 'all');
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Assessment / unit tests scheduled during requested event dates.');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingCount = odRequests.filter(r => r.status === 'PENDING').length;
  const approvedCount = odRequests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = odRequests.filter(r => r.status === 'REJECTED').length;

  const tabs = [
    { id: 'all', label: 'All Requests', count: odRequests.length },
    { id: 'pending', label: 'Pending Review', count: pendingCount },
    { id: 'approved', label: 'Approved', count: approvedCount },
    { id: 'rejected', label: 'Rejected', count: rejectedCount },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'all' ? {} : { status: tabId.toUpperCase() });
  };

  const handleApprove = (id) => {
    approveOD(id, user?.name || 'Dr. K. Ramanathan');
  };

  const openRejectModal = (id) => {
    setRejectTargetId(id);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = (e) => {
    e.preventDefault();
    if (rejectTargetId) {
      setIsProcessing(true);
      setTimeout(() => {
        rejectOD(rejectTargetId, rejectReason, user?.name || 'Dr. K. Ramanathan');
        setIsProcessing(false);
        setRejectModalOpen(false);
        setRejectTargetId(null);
      }, 400);
    }
  };

  // Filtered dataset
  const filtered = odRequests.filter((req) => {
    if (activeTab === 'pending' && req.status !== 'PENDING') return false;
    if (activeTab === 'approved' && req.status !== 'APPROVED') return false;
    if (activeTab === 'rejected' && req.status !== 'REJECTED') return false;

    if (deptFilter && !req.department?.toLowerCase().includes(deptFilter.toLowerCase())) {
      return false;
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        req.studentName.toLowerCase().includes(q) ||
        req.registerNumber.toLowerCase().includes(q) ||
        req.eventTitle.toLowerCase().includes(q) ||
        req.college.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const columns = [
    { header: "Student & Register No" },
    { header: "Department" },
    { header: "Event & College" },
    { header: "Dates & Duration" },
    { header: "Status" },
    { header: "Faculty Actions", className: "text-right" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            On-Duty (OD) Application Review
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review student participation applications and grant official On-Duty attendance permissions.
          </p>
        </div>

        {pendingCount > 0 && (
          <Badge variant="od-pending" size="md">
            {pendingCount} Pending Applications Awaiting Action
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* Search & Dept Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search student name, register number (e.g. 23CSE001), or event..."
          className="flex-1"
        />
        <div className="w-full sm:w-64">
          <Select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            placeholder="All Departments"
            options={[
              "Computer Science and Engineering",
              "Information Technology",
              "Artificial Intelligence and Data Science",
              "Electronics and Communication",
              "Mechanical Engineering"
            ]}
          />
        </div>
      </div>

      {/* Requests Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No OD requests found"
          description="There are no applications matching your current status filter or search parameters."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table
            columns={columns}
            data={filtered}
            renderRow={(req) => (
              <tr key={req.id} className="hover:bg-slate-50/80 transition text-xs">
                {/* Student */}
                <td className="px-4 py-3.5">
                  <p className="font-bold text-slate-900">{req.studentName}</p>
                  <span className="font-mono text-slate-500 font-semibold">{req.registerNumber}</span>
                  <span className="text-slate-400 block text-[11px] mt-0.5">{req.year}</span>
                </td>

                {/* Department */}
                <td className="px-4 py-3.5 text-slate-600">
                  <span className="font-medium">{req.department}</span>
                </td>

                {/* Event */}
                <td className="px-4 py-3.5 max-w-xs">
                  <p className="font-bold text-slate-900 truncate">{req.eventTitle}</p>
                  <p className="text-[11px] text-slate-400 truncate">{req.college}</p>
                </td>

                {/* Dates & Duration */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <p className="font-semibold text-slate-800">{req.odDuration}</p>
                  <p className="text-[11px] text-slate-400">{req.eventDates}</p>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge
                    variant={
                      req.status === 'APPROVED'
                        ? 'od-approved'
                        : req.status === 'PENDING'
                        ? 'od-pending'
                        : 'od-rejected'
                    }
                    size="sm"
                  >
                    {req.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link to={`/staff/od/${req.id}`}>
                      <Button variant="ghost" size="sm" leftIcon={Eye} title="Inspect Details">
                        Details
                      </Button>
                    </Link>

                    {req.status === 'PENDING' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          leftIcon={CheckCircle2}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRejectModal(req.id)}
                          leftIcon={XCircle}
                          className="text-rose-700 border-rose-200 hover:bg-rose-50"
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {req.status === 'APPROVED' && (
                      <span className="text-[11px] text-emerald-600 font-semibold px-2 py-1 bg-emerald-50 rounded-md">
                        ✓ Approved by {req.reviewedBy?.split(' ')[0] || 'Staff'}
                      </span>
                    )}

                    {req.status === 'REJECTED' && (
                      <span className="text-[11px] text-rose-600 font-semibold px-2 py-1 bg-rose-50 rounded-md">
                        Rejected
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reason for OD Rejection"
        subtitle="Provide specific constructive feedback to the student explaining why this request cannot be approved."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRejectConfirm} className="space-y-4">
          <Textarea
            label="Rejection Reason / Feedback *"
            id="rejectionReason"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Internal assessment exam scheduled on event dates..."
            required
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              leftIcon={XCircle}
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
