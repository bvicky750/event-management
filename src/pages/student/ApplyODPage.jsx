import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  Calendar,
  Building2,
  User,
  GraduationCap,
  ArrowLeft,
  Clock,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { Badge } from '../../components/common/Badge';

export const ApplyODPage = () => {
  const { eventId } = useParams();
  const { events, applyForOD } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const event = events.find(e => String(e.id) === String(eventId) || String(e.id) === `evt_${eventId}`) || events[0];

  const [studentName, setStudentName] = useState(user?.name || "Vignesh B");
  const [registerNumber, setRegisterNumber] = useState(user?.registerNumber || "23CSE001");
  const [department, setDepartment] = useState(user?.department || "Computer Science and Engineering");
  const [year, setYear] = useState(user?.year || "2nd Year");
  const [selectedActivities, setSelectedActivities] = useState(
    event.activities && event.activities.length > 0 ? [event.activities[0].name] : []
  );
  const [odDuration, setOdDuration] = useState("2 Days (Full Day)");
  const [reason, setReason] = useState("Selected to present our original research paper and participate in the AI technical competition representing our institution.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleActivity = (actName) => {
    if (selectedActivities.includes(actName)) {
      setSelectedActivities(selectedActivities.filter(a => a !== actName));
    } else {
      setSelectedActivities([...selectedActivities, actName]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      applyForOD({
        studentId: user?.id || "stud_001",
        studentName,
        registerNumber,
        department,
        year,
        email: user?.email || "student@college.edu",
        phone: user?.phone || "+91 98765 43210",
        eventId: event.id,
        eventTitle: event.title,
        college: event.organizer?.institution || "College",
        eventDates: `${event.startDate} ${event.endDate && event.endDate !== event.startDate ? `- ${event.endDate}` : ''}`,
        startDate: event.startDate,
        endDate: event.endDate || event.startDate,
        odDuration,
        selectedActivities: selectedActivities.length > 0 ? selectedActivities : [event.title],
        reason
      });

      setIsSubmitting(false);
      navigate('/student/od');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to={`/events/${event.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {event.title}</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Official On-Duty (OD) Request</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Apply for On-Duty (OD)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit your participation request to the Department Faculty Advisor for official attendance concession.
            </p>
          </div>
        </div>

        {/* Selected Event Card Summary */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
          <img
            src={event.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80"}
            alt={event.title}
            className="w-20 h-20 rounded-xl object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0 text-xs space-y-1">
            <Badge variant="primary" size="sm">
              {event.category}
            </Badge>
            <h3 className="text-sm font-bold text-slate-900 truncate">{event.title}</h3>
            <p className="text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span className="truncate">{event.organizer?.institution}</span>
            </p>
            <p className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.startDate} {event.endDate && event.endDate !== event.startDate ? `— ${event.endDate}` : ''}</span>
            </p>
          </div>
        </div>

        {/* OD Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Student Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Student Academic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Student Full Name"
                id="name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
              <Input
                label="Register Number"
                id="regNo"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                required
              />
              <Input
                label="Department"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
              <Select
                label="Year of Study"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder=""
                options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
                required
              />
            </div>
          </div>

          {/* Section 2: Selected Activities & OD Duration */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Participation Details & Duration
            </h4>

            {event.activities && event.activities.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Select Activities / Tracks You Will Compete In *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {event.activities.map((act) => {
                    const isSelected = selectedActivities.includes(act.name);
                    return (
                      <div
                        key={act.name}
                        onClick={() => handleToggleActivity(act.name)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-500 font-bold text-brand-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                          />
                          <span>{act.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{act.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Requested OD Duration"
                id="odDuration"
                value={odDuration}
                onChange={(e) => setOdDuration(e.target.value)}
                placeholder=""
                options={[
                  "1 Day (Full Day)",
                  "2 Days (Full Day)",
                  "Half Day (Forenoon)",
                  "Half Day (Afternoon)",
                  "3 Days (Full Day)"
                ]}
                required
              />

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  OD attendance is subject to faculty verification of participation receipt / certificate upon return.
                </p>
              </div>
            </div>

            <Textarea
              label="Reason for Participation & Project Description"
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain your participation purpose, paper topic, or team composition..."
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={FileCheck2}
            >
              Submit OD Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
