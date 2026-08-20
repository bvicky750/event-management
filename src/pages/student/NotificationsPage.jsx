import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Tabs } from '../../components/common/Tabs';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');

  const myNotifs = notifications.filter(
    n => n.recipientRole === 'student' || n.recipientId === user?.id
  );

  const unreadNotifs = myNotifs.filter(n => !n.read);

  const tabs = [
    { id: 'all', label: 'All Notifications', count: myNotifs.length },
    { id: 'unread', label: 'Unread', count: unreadNotifs.length },
  ];

  const currentList = activeTab === 'unread' ? unreadNotifs : myNotifs;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Updates on your OD applications, registration tickets, and upcoming events.
          </p>
        </div>

        {unreadNotifs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={CheckCheck}
            onClick={() => markAllNotificationsRead(role, user?.id)}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Notifications List */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! There are no unread notifications for your account."
        />
      ) : (
        <div className="space-y-3">
          {currentList.map((n) => {
            return (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.link) navigate(n.link);
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                  !n.read
                    ? 'bg-brand-50/60 border-brand-200 hover:border-brand-300 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  n.type === 'success'
                    ? 'bg-emerald-100 text-emerald-700'
                    : n.type === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {n.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : n.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {n.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
