import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  Eye,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Ticket
} from 'lucide-react';
import { Tabs } from '../../components/common/Tabs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

export const MyODRequestsPage = () => {
  const { odRequests } = useData();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [selectedOD, setSelectedOD] = useState(null);

  // Student's ODs
  const myRequests = odRequests.filter(r => r.studentId === user?.id);

  const pendingCount = myRequests.filter(r => r.status === 'PENDING').length;
  const approvedCount = myRequests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = myRequests.filter(r => r.status === 'REJECTED').length;

  const tabs = [
    { id: 'all', label: 'All Requests', count: myRequests.length },
    { id: 'pending', label: 'Pending Review', count: pendingCount },
    { id: 'approved', label: 'Approved OD', count: approvedCount },
    { id: 'rejected', label: 'Rejected', count: rejectedCount },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'all' ? {} : { tab: tabId });
  };

  const filteredRequests = myRequests.filter((r) => {
    if (activeTab === 'pending') return r.status === 'PENDING';
    if (activeTab === 'approved') return r.status === 'APPROVED';
    if (activeTab === 'rejected') return r.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My On-Duty (OD) Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time status of your event OD requests submitted to faculty coordinators.
          </p>
        </div>

        <Link to="/events?odAvailable=true">
          <Button variant="primary" size="sm" leftIcon={Sparkles}>
            Apply for New OD
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title={`No ${activeTab !== 'all' ? activeTab : ''} OD requests found`}
          description="You don't have any On-Duty applications under this status tab."
          actionLabel="Browse Events with OD Available"
          onAction={() => window.location.href = '/events?odAvailable=true'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => {
            const isApproved = req.status === 'APPROVED';
            const isPending = req.status === 'PENDING';
            const isRejected = req.status === 'REJECTED';

            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all duration-200 bg-white shadow-xs hover:shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isApproved ? 'border-emerald-200 hover:border-emerald-300' : isRejected ? 'border-rose-200 hover:border-rose-300' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">{req.eventTitle}</h3>
                    <Badge
                      variant={isApproved ? 'od-approved' : isPending ? 'od-pending' : 'od-rejected'}
                      size="sm"
                    >
                      {req.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">ID: {req.id}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.college}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.eventDates}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.odDuration}</span>
                    </span>
                    <span className="text-slate-400">
                      Applied: {req.appliedAt}
                    </span>
                  </div>

                  {/* Selected Tracks */}
                  {req.selectedActivities && req.selectedActivities.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400">Activities:</span>
                      {req.selectedActivities.map((act, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {act}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rejection Reason Notice */}
                  {isRejected && req.rejectionReason && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-0.5">
                      <p className="font-bold flex items-center gap-1.5 text-rose-900">
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span>Reason for Rejection:</span>
                      </p>
                      <p className="pl-5 text-rose-700 leading-relaxed">{req.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Eye}
                    onClick={() => setSelectedOD(req)}
                  >
                    View Details
                  </Button>

                  {isApproved && (
                    <Link to={`/events/${req.eventId}`}>
                      <Button variant="primary" size="sm" leftIcon={Ticket}>
                        Register Now
                      </Button>
                    </Link>
                  )}

                  {isRejected && (
                    <Link to={`/student/od/apply/${req.eventId}`}>
                      <Button variant="secondary" size="sm">
                        Re-apply
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedOD}
        onClose={() => setSelectedOD(null)}
        title="On-Duty (OD) Application Details"
        subtitle={`Application Reference: ${selectedOD?.id}`}
        maxWidth="max-w-xl"
      >
        {selectedOD && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Application Status</span>
                <Badge
                  variant={selectedOD.status === 'APPROVED' ? 'od-approved' : selectedOD.status === 'PENDING' ? 'od-pending' : 'od-rejected'}
                >
                  {selectedOD.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Event Title</span>
                <span className="font-bold text-slate-900">{selectedOD.eventTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Host Institution</span>
                <span className="text-slate-700">{selectedOD.college}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Requested Duration</span>
                <span className="font-semibold text-slate-900">{selectedOD.odDuration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Application Timestamp</span>
                <span className="text-slate-700">{selectedOD.appliedAt}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Student & Participation Summary
              </p>
              <p><span className="text-slate-400">Student Name:</span> <span className="font-semibold text-slate-800">{selectedOD.studentName} ({selectedOD.registerNumber})</span></p>
              <p><span className="text-slate-400">Department:</span> {selectedOD.department}</p>
              <p><span className="text-slate-400">Selected Activities:</span> {selectedOD.selectedActivities?.join(', ') || 'General Participation'}</p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block mb-1">Reason for Participation:</span>
                <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                  "{selectedOD.reason}"
                </p>
              </div>
            </div>

            {selectedOD.status === 'APPROVED' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between">
                <div>
                  <p className="font-bold">Approved by Faculty</p>
                  <p className="text-[10px] text-emerald-700">Verified by {selectedOD.reviewedBy || "Dr. K. Ramanathan"}</p>
                </div>
                <Link to={`/events/${selectedOD.eventId}`}>
                  <Button variant="success" size="sm">
                    Complete Registration →
                  </Button>
                </Link>
              </div>
            )}

            {selectedOD.status === 'REJECTED' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                <p className="font-bold">Rejection Feedback:</p>
                <p className="mt-1 leading-relaxed">{selectedOD.rejectionReason}</p>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedOD(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
