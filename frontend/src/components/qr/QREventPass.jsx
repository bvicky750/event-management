import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Building2, User, Printer, Download, CheckCircle2, ShieldCheck, Ticket } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const QREventPass = ({ registration }) => {
  const passRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const isCheckedIn = registration.attendanceStatus === 'PRESENT' || registration.status === 'ATTENDED';

  return (
    <div className="max-w-md mx-auto">
      {/* Ticket Pass Card */}
      <div
        ref={passRef}
        className="rounded-3xl border border-slate-300 bg-white shadow-ticket overflow-hidden relative print:border-black print:shadow-none"
      >
        {/* Pass Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Official Event Entry Pass</span>
                <p className="text-[10px] text-slate-400 font-mono">{registration.registrationNumber}</p>
              </div>
            </div>
            {isCheckedIn ? (
              <Badge variant="success" size="sm" dot>
                Checked In
              </Badge>
            ) : (
              <Badge variant="primary" size="sm">
                Valid Pass
              </Badge>
            )}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white line-clamp-2">
            {registration.eventTitle}
          </h2>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            <span className="truncate">{registration.college}</span>
          </p>
        </div>

        {/* QR Code Section */}
        <div className="p-6 bg-slate-50/50 flex flex-col items-center justify-center border-b border-dashed border-slate-300 relative">
          {/* Perforated ticket notches */}
          <div className="ticket-scallop-left" />
          <div className="ticket-scallop-right" />

          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
            <QRCodeSVG
              value={registration.qrCodeToken || registration.registrationNumber}
              size={180}
              level="H"
              includeMargin={true}
              fgColor="#0f172a"
            />
            <span className="mt-2 text-xs font-mono font-bold tracking-widest text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
              {registration.registrationNumber}
            </span>
          </div>

          <p className="mt-3 text-xs text-center font-medium text-slate-500 max-w-xs">
            Show this QR code at the registration desk / event entrance for instant attendance verification.
          </p>
        </div>

        {/* Participant Details */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-slate-400 font-medium">Attendee Name</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{registration.studentName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Register Number</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{registration.registerNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Department</p>
              <p className="font-semibold text-slate-700 mt-0.5">{registration.department}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Payment Status</p>
              <p className="font-bold text-emerald-600 mt-0.5">{registration.paymentStatus || 'PAID'}</p>
            </div>
          </div>

          {/* Schedule & Venue Details */}
          <div className="space-y-2 text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800">{registration.eventDates}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <span>{registration.venue}</span>
            </div>
          </div>

          {/* Selected Activities */}
          {registration.activities && registration.activities.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-slate-400 font-medium mb-1.5">Registered Activities:</p>
              <div className="flex flex-wrap gap-1.5">
                {registration.activities.map((act, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-medium text-[11px]">
                    {act}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Check-in verification stamp if already present */}
          {isCheckedIn && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-bold">Checked-In</p>
                  <p className="text-[10px] text-emerald-700">Time: {registration.checkInTime || '10:14 AM'}</p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-500 opacity-60" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-center gap-3 print:hidden">
        <Button variant="outline" size="md" leftIcon={Printer} onClick={handlePrint}>
          Print / Save PDF
        </Button>
      </div>
    </div>
  );
};
