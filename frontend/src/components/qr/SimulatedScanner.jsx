import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Camera,
  Users,
  Building2,
  Calendar
} from 'lucide-react';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Card } from '../common/Card';

export const SimulatedScanner = ({ selectedEventId, onEventSelect }) => {
  const { events, registrations, recordCheckInScan } = useData();
  const { user } = useAuth();

  const [activeEventId, setActiveEventId] = useState(selectedEventId || events[0]?.id || 'evt_1');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const currentEvent = events.find(e => String(e.id) === String(activeEventId)) || events[0];

  const handleEventChange = (e) => {
    const newId = e.target.value;
    setActiveEventId(newId);
    setScanResult(null);
    if (onEventSelect) onEventSelect(newId);
  };

  const executeSimulation = (tokenToScan) => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const res = recordCheckInScan(activeEventId, tokenToScan, user?.name);
      setScanResult(res);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Event Selection Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <Select
            label="Active Event for Attendance"
            value={activeEventId}
            onChange={handleEventChange}
            placeholder=""
            options={events.map(ev => ({
              value: ev.id,
              label: `${ev.title} (${ev.startDate}) — ${ev.organizer?.institution || 'College'}`
            }))}
          />
        </div>
      </div>

      {/* Camera Viewfinder Mock */}
      <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-8 overflow-hidden shadow-2xl border border-slate-800 text-center max-w-lg mx-auto">
        {/* Top Header inside camera */}
        <div className="flex items-center justify-between text-slate-400 text-xs mb-6">
          <div className="flex items-center gap-1.5 font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>LIVE SCANNER ACTIVE</span>
          </div>
          <span className="text-slate-500 font-mono">1080p • 60 FPS</span>
        </div>

        {/* Viewfinder Target Area */}
        <div className="relative w-64 h-64 mx-auto rounded-2xl border-2 border-dashed border-brand-400/80 bg-brand-950/20 flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Animated Laser Bar */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400 animate-laser" />

          {/* Corner Guides */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-brand-400" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-brand-400" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-brand-400" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-brand-400" />

          <QrCode className="w-20 h-20 text-slate-600/60" />
          <p className="text-[11px] text-slate-300 font-medium mt-3 px-2">
            Align student's registration QR code inside the frame
          </p>
        </div>

        {/* Selected Event Details Footer in Viewfinder */}
        <p className="text-xs text-slate-400 font-medium mt-6 truncate">
          Scanning for: <span className="text-white font-bold">{currentEvent?.title}</span>
        </p>
      </div>

      {/* Simulation Trigger Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Simulate Scan Actions (Phase 1 Prototype Demo)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Test real-time check-in and edge case handling with one click:
        </p>

        <div className="space-y-2.5">
          {/* Main Success Trigger for Vignesh B */}
          <Button
            variant="success"
            size="md"
            className="w-full justify-center shadow-sm"
            isLoading={isScanning}
            onClick={() => executeSimulation("REG-DEMO-2026-001")}
            leftIcon={CheckCircle2}
          >
            ✓ Simulate Successful Scan (Vignesh B - 23CSE001)
          </Button>

          {/* Secondary Success Trigger for Ananya */}
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            isLoading={isScanning}
            onClick={() => executeSimulation("REG-DEMO-2026-003")}
            leftIcon={CheckCircle2}
          >
            ✓ Simulate Scan for Ananya S (23IT042)
          </Button>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              isLoading={isScanning}
              onClick={() => executeSimulation("REG-INVALID-999")}
              leftIcon={AlertCircle}
              className="text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              Test Invalid QR
            </Button>
            <Button
              variant="outline"
              size="sm"
              isLoading={isScanning}
              onClick={() => executeSimulation("REG-DEMO-2026-004")}
              leftIcon={AlertTriangle}
              className="text-amber-800 border-amber-200 hover:bg-amber-50"
            >
              Test Wrong Event
            </Button>
          </div>
        </div>
      </div>

      {/* Scan Feedback Results Card */}
      {scanResult && (
        <div className="max-w-lg mx-auto animate-scale-in">
          {scanResult.success ? (
            <div className="rounded-2xl bg-emerald-900/90 text-white p-6 border border-emerald-500/40 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                    Attendance Marked Successfully
                  </span>
                  <h4 className="text-xl font-black mt-1 text-white">{scanResult.student.studentName}</h4>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-emerald-100 bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/20 font-mono">
                    <div>
                      <span className="text-emerald-400 block text-[10px]">REGISTER NO</span>
                      <span className="font-bold">{scanResult.student.registerNumber}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block text-[10px]">CHECK-IN TIME</span>
                      <span className="font-bold">{scanResult.checkInTime}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-emerald-400 block text-[10px]">DEPARTMENT</span>
                      <span>{scanResult.student.department}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl p-6 border shadow-xl ${
              scanResult.errorType === 'ALREADY_CHECKED_IN'
                ? 'bg-amber-950 text-amber-50 border-amber-700'
                : 'bg-rose-950 text-rose-50 border-rose-700'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shadow-md text-white ${
                  scanResult.errorType === 'ALREADY_CHECKED_IN' ? 'bg-amber-600' : 'bg-rose-600'
                }`}>
                  {scanResult.errorType === 'ALREADY_CHECKED_IN' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <AlertCircle className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                    {scanResult.errorType === 'ALREADY_CHECKED_IN' ? 'Already Checked In' : 'Verification Failed'}
                  </span>
                  <h4 className="text-lg font-bold mt-1 text-white">{scanResult.message}</h4>
                  {scanResult.student && (
                    <p className="text-xs mt-2 opacity-80">
                      Student: {scanResult.student.studentName} ({scanResult.student.registerNumber})
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
