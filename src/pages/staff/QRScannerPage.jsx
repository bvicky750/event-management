import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SimulatedScanner } from '../../components/qr/SimulatedScanner';
import { QrCode, Sparkles, ShieldCheck } from 'lucide-react';

export const QRScannerPage = () => {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || 'evt_1';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
          <QrCode className="w-3.5 h-3.5" />
          <span>Entrance Check-In Terminal</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          QR Attendance Scanner
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Scan student event entry passes to record verified attendance in real time.
        </p>
      </div>

      {/* Live Scanner Component */}
      <SimulatedScanner selectedEventId={initialEventId} />
    </div>
  );
};
