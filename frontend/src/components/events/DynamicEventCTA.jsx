import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Ticket,
  Lock,
  ArrowRight,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const DynamicEventCTA = ({ event }) => {
  const { user, role } = useAuth();
  const { odRequests, registrations, registerForEvent } = useData();
  const navigate = useNavigate();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check state
  const isFull = (event.registeredCount || 0) >= (event.capacity || 9999);
  const isClosed = new Date(event.registrationDeadline) < new Date('2026-08-17');

  // Check student registration
  const existingRegistration = registrations.find(
    r => r.studentId === user?.id && (String(r.eventId) === String(event.id) || String(r.eventId) === `evt_${event.id}`) && r.status !== 'CANCELLED'
  );

  // Check OD status
  const existingOD = odRequests.find(
    r => r.studentId === user?.id && (String(r.eventId) === String(event.id) || String(r.eventId) === `evt_${event.id}`)
  );

  const odStatus = existingOD ? existingOD.status : null; // 'PENDING', 'APPROVED', 'REJECTED' or null
  const odRequired = event.od?.available && event.od?.requiresApproval;

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const totalFee = (event.registrationFee || 0) +
      (selectedActivities.length > 0 ? selectedActivities.reduce((acc, actName) => {
        const act = event.activities?.find(a => a.name === actName);
        return acc + (act?.fee || 0);
      }, 0) : 0);

    setTimeout(() => {
      const regRecord = registerForEvent({
        studentId: user?.id || "stud_001",
        studentName: user?.name || "Vignesh B",
        registerNumber: user?.registerNumber || "23CSE001",
        department: user?.department || "Computer Science and Engineering",
        email: user?.email || "student@college.edu",
        phone: user?.phone || "+91 98765 43210",
        eventId: event.id,
        eventTitle: event.title,
        college: event.organizer?.institution || "College",
        venue: `${event.venue}, ${event.city}`,
        eventDates: `${event.startDate} ${event.endDate && event.endDate !== event.startDate ? `- ${event.endDate}` : ''}`,
        activities: selectedActivities.length > 0 ? selectedActivities : [event.title],
        amountPaid: totalFee,
        paymentStatus: totalFee === 0 ? "FREE" : "PAID"
      });

      setIsSubmitting(false);
      setRegisterModalOpen(false);
      navigate(`/student/registrations/${regRecord.id}`);
    }, 600);
  };

  // If user is Staff / Faculty, show staff quick action button
  if (role === 'staff') {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/staff/events/${event.id}/registrations`} className="flex-1">
          <Button variant="secondary" className="w-full" leftIcon={Ticket}>
            View Registrations ({event.registeredCount || 0})
          </Button>
        </Link>
        <Link to={`/staff/events/${event.id}/attendance`} className="flex-1">
          <Button variant="primary" className="w-full" leftIcon={CheckCircle2}>
            Event Attendance
          </Button>
        </Link>
      </div>
    );
  }

  // Case 1: Already Registered
  if (existingRegistration) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>You are registered for this event! (Pass ID: {existingRegistration.registrationNumber})</span>
        </div>
        <Link to={`/student/registrations/${existingRegistration.id}`} className="block">
          <Button variant="success" size="lg" className="w-full shadow-md" leftIcon={Ticket}>
            View My Registration Pass
          </Button>
        </Link>
      </div>
    );
  }

  // Case 2: Registration Closed
  if (isClosed) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-semibold">
          <Lock className="w-4 h-4 text-rose-500" />
          <span>Registration deadline has passed ({event.registrationDeadline}).</span>
        </div>
        <Button variant="secondary" size="lg" disabled className="w-full">
          Registration Closed
        </Button>
      </div>
    );
  }

  // Case 3: Event Full
  if (isFull) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>All {event.capacity} seats for this event have been filled.</span>
        </div>
        <Button variant="secondary" size="lg" disabled className="w-full">
          Event Full
        </Button>
      </div>
    );
  }

  // Case 4: OD Required & Status is PENDING
  if (odRequired && odStatus === 'PENDING') {
    return (
      <div className="space-y-3">
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 animate-spin" />
          <div>
            <p className="font-bold">OD Application Under Faculty Review</p>
            <p className="text-amber-700 mt-0.5">Your OD request has been submitted to Dr. K. Ramanathan. You can register as soon as it is approved.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" disabled className="flex-1 bg-amber-100/50 text-amber-900 border-amber-200">
            🟡 OD Approval Pending
          </Button>
          <Link to="/student/od">
            <Button variant="outline" size="lg">
              Track OD
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Case 5: OD Required & Status is REJECTED
  if (odRequired && odStatus === 'REJECTED') {
    return (
      <div className="space-y-3">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">OD Request Rejected</p>
            <p className="text-rose-700 mt-0.5">Reason: {existingOD.rejectionReason || "Criteria not met."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/student/od/apply/${event.id}`} className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Re-apply for OD
            </Button>
          </Link>
          <Link to="/student/od">
            <Button variant="secondary" size="lg">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Case 6: OD Required & Not Applied Yet
  if (odRequired && !odStatus) {
    return (
      <div className="space-y-3">
        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
          <FileCheck2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-900">On-Duty (OD) is available for this event</p>
            <p className="text-emerald-700 mt-0.5">Faculty approval is required before you can finalize your registration and attend with attendance concession.</p>
          </div>
        </div>

        <Link to={`/student/od/apply/${event.id}`} className="block">
          <Button variant="gradient" size="lg" className="w-full shadow-md text-base" leftIcon={FileCheck2}>
            Apply for On-Duty (OD)
          </Button>
        </Link>
      </div>
    );
  }

  // Case 7 & 8: OD Approved OR OD Not Required -> Allow Registration!
  return (
    <>
      <div className="space-y-3">
        {odStatus === 'APPROVED' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>✓ Your OD has been Approved! You are ready to register.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 shadow-md text-base"
            rightIcon={ArrowRight}
            onClick={() => setRegisterModalOpen(true)}
          >
            Register Now ({event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`})
          </Button>

          {event.externalUrl && (
            <a
              href={event.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:w-auto"
            >
              <Button variant="outline" size="lg" className="w-full" rightIcon={ExternalLink}>
                Official Portal
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title={`Register for ${event.title}`}
        subtitle="Confirm your student details and select activities to generate your instant QR Pass."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Participant Name</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.name || "Vignesh B"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Register Number</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5 font-mono">{user?.registerNumber || "23CSE001"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Department</p>
              <p className="font-semibold text-slate-700 mt-0.5">{user?.department || "CSE"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Event Date</p>
              <p className="font-semibold text-slate-700 mt-0.5">{event.startDate}</p>
            </div>
          </div>

          {/* Activity Selection if available */}
          {event.activities && event.activities.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Select Activity / Competition Tracks
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {event.activities.map((act) => {
                  const isChecked = selectedActivities.includes(act.name);
                  return (
                    <label
                      key={act.name}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition ${
                        isChecked ? 'bg-brand-50/80 border-brand-500 font-semibold' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedActivities([...selectedActivities, act.name]);
                            } else {
                              setSelectedActivities(selectedActivities.filter(a => a !== act.name));
                            }
                          }}
                          className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                        />
                        <span className="text-slate-900">{act.name}</span>
                      </div>
                      <span className="text-slate-600 font-medium">
                        {act.fee === 0 ? 'Included' : `+₹${act.fee}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-slate-300">Total Registration Fee</p>
              <p className="text-xs text-emerald-400">Includes Entry & Certificate</p>
            </div>
            <span className="text-xl font-bold">
              {event.registrationFee === 0 ? 'FREE' : `₹${event.registrationFee}`}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setRegisterModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={Ticket}
            >
              Confirm & Generate QR Pass
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
