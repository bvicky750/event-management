import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Ticket } from 'lucide-react';
import { QREventPass } from '../../components/qr/QREventPass';
import { EmptyState } from '../../components/common/EmptyState';

export const RegistrationPassPage = () => {
  const { id } = useParams();
  const { registrations } = useData();
  const navigate = useNavigate();

  const reg = registrations.find(
    r => String(r.id) === String(id) || r.registrationNumber === id || String(r.eventId) === String(id)
  ) || registrations[0];

  if (!reg) {
    return (
      <div className="max-w-md mx-auto py-16">
        <EmptyState
          icon={Ticket}
          title="Pass Not Found"
          description="We couldn't find a registration pass with the specified ID."
          actionLabel="Back to Registrations"
          onAction={() => navigate('/student/registrations')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/registrations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition print:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Registrations</span>
        </Link>
      </div>

      {/* Ticket Pass Component */}
      <QREventPass registration={reg} />
    </div>
  );
};
