import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Ticket,
  Calendar,
  MapPin,
  Building2,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Tabs } from '../../components/common/Tabs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

export const MyRegistrationsPage = () => {
  const { registrations } = useData();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'upcoming');

  const myRegs = registrations.filter(r => r.studentId === user?.id);

  const upcomingRegs = myRegs.filter(r => r.status === 'CONFIRMED' && r.attendanceStatus !== 'PRESENT');
  const attendedRegs = myRegs.filter(r => r.status === 'ATTENDED' || r.attendanceStatus === 'PRESENT');
  const cancelledRegs = myRegs.filter(r => r.status === 'CANCELLED');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events', count: upcomingRegs.length },
    { id: 'attended', label: 'Attended', count: attendedRegs.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelledRegs.length },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'upcoming' ? {} : { tab: tabId });
  };

  const currentList = activeTab === 'upcoming'
    ? upcomingRegs
    : activeTab === 'attended'
    ? attendedRegs
    : cancelledRegs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your confirmed entry passes, QR codes, and past event attendance.
          </p>
        </div>

        <Link to="/events">
          <Button variant="primary" size="sm" leftIcon={Sparkles}>
            Explore More Events
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* Registrations List */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title={`No ${activeTab} registrations found`}
          description="You don't have any event passes under this category."
          actionLabel="Discover Events to Register"
          onAction={() => window.location.href = '/events'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentList.map((reg) => (
            <div
              key={reg.id}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                    {reg.registrationNumber}
                  </span>
                  <Badge
                    variant={
                      reg.attendanceStatus === 'PRESENT'
                        ? 'attended'
                        : reg.status === 'CONFIRMED'
                        ? 'registered'
                        : 'danger'
                    }
                    size="sm"
                    dot
                  >
                    {reg.attendanceStatus === 'PRESENT' ? 'Attended (Present)' : reg.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{reg.eventTitle}</h3>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{reg.college}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{reg.eventDates}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{reg.venue}</span>
                  </p>
                </div>

                {reg.activities && reg.activities.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {reg.activities.map((act, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {act}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400">Payment: </span>
                  <span className="font-bold text-emerald-600">
                    {reg.amountPaid === 0 ? 'FREE' : `₹${reg.amountPaid}`} ({reg.paymentStatus})
                  </span>
                </div>

                <Link to={`/student/registrations/${reg.id}`}>
                  <Button variant="primary" size="sm" leftIcon={QrCode}>
                    View QR Pass
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
