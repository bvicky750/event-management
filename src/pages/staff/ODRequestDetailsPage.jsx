import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  User,
  GraduationCap,
  Calendar,
  Building2,
  Clock,
  Mail,
  Phone,
  Tag,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Textarea } from '../../components/common/Textarea';
import { EmptyState } from '../../components/common/EmptyState';

export const ODRequestDetailsPage = () => {
  const { id } = useParams();
  const { odRequests, approveOD, rejectOD } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Assessment / unit test dates overlap with requested event.');
  const [isProcessing, setIsProcessing] = useState(false);

  const req = odRequests.find(r => String(r.id) === String(id));

  if (!req) {
    return (
      <div className="max-w-md mx-auto py-16">
        <EmptyState
          title="OD Request Not Found"
          description="Could not locate the specified OD application."
          actionLabel="Back to OD Requests"
          onAction={() => navigate('/staff/od')}
        />
      </div>
    );
  }

  const handleApprove = () => {
    approveOD(req.id, user?.name || 'Dr. K. Ramanathan');
  };

  const handleRejectConfirm = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      rejectOD(req.id, rejectReason, user?.name || 'Dr. K. Ramanathan');
      setIsProcessing(false);
      setRejectModalOpen(false);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/staff/od"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to OD Requests</span>
      </Link>

      {/* Main Inspection Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-8">
        {/* Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-slate-400">ID: {req.id}</span>
              <Badge
                variant={
                  req.status === 'APPROVED'
                    ? 'od-approved'
                    : req.status === 'PENDING'
                    ? 'od-pending'
                    : 'od-rejected'
                }
                size="md"
              >
                {req.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              On-Duty Application Review
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Submitted: {req.appliedAt}</p>
          </div>

          {/* Action Buttons if Pending */}
          {req.status === 'PENDING' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setRejectModalOpen(true)}
                leftIcon={XCircle}
                className="text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                Reject Request
              </Button>
              <Button
                variant="success"
                size="md"
                onClick={handleApprove}
                leftIcon={CheckCircle2}
              >
                Approve OD
              </Button>
            </div>
          ) : req.status === 'APPROVED' ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Approved by {req.reviewedBy} on {req.reviewedAt}</span>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Rejected on {req.reviewedAt}</span>
            </div>
          )}
        </div>

        {/* Section 1: Student Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Applicant Student Details
          </h3>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Student Full Name</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{req.studentName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Register Number</p>
              <p className="font-bold text-brand-600 text-sm mt-0.5 font-mono">{req.registerNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Year & Department</p>
              <p className="font-semibold text-slate-800 mt-0.5">{req.year} • {req.department}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Email</p>
              <p className="text-slate-700 mt-0.5">{req.email || "student@college.edu"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Phone</p>
              <p className="text-slate-700 mt-0.5">{req.phone || "+91 98765 43210"}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Event Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Event & Requested OD Duration
          </h3>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 font-medium">Event Title</p>
                <p className="font-bold text-slate-900 text-base mt-0.5">{req.eventTitle}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Host Institution / College</p>
                <p className="font-semibold text-slate-800 mt-0.5">{req.college}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Event Dates</p>
                <p className="font-semibold text-slate-800 mt-0.5">{req.eventDates}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Requested OD Duration</p>
                <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200 inline-block mt-0.5">
                  {req.odDuration}
                </span>
              </div>
            </div>

            {/* Selected activities */}
            {req.selectedActivities && req.selectedActivities.length > 0 && (
              <div className="pt-3 border-t border-slate-200/80">
                <p className="text-slate-400 font-medium mb-1.5">Selected Activity / Competition Tracks:</p>
                <div className="flex flex-wrap gap-2">
                  {req.selectedActivities.map((act, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium text-xs shadow-2xs">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Student's Stated Purpose */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Student's Reason for Participation
          </h3>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs leading-relaxed text-slate-700 italic">
            "{req.reason}"
          </div>
        </div>

        {/* Rejection Reason display if rejected */}
        {req.status === 'REJECTED' && req.rejectionReason && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Recorded Rejection Reason:</span>
            </p>
            <p className="pl-5 text-rose-700 leading-relaxed">{req.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reason for OD Rejection"
        subtitle={`Student: ${req.studentName} (${req.registerNumber})`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRejectConfirm} className="space-y-4">
          <Textarea
            label="Provide Rejection Reason / Academic Feedback *"
            id="rejReason"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this OD request cannot be granted..."
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
