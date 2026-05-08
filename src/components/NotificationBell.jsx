import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';

/**
 * NotificationBell — bell icon with an unread-count badge.
 * Links to /alerts. Live-updates via the useAlerts hook's Realtime sub.
 */
export function NotificationBell() {
  const { unreadCount } = useAlerts({ limit: 50 });

  return (
    <Link
      to="/alerts"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/60 transition-colors"
      aria-label={
        unreadCount > 0
          ? `${unreadCount} new ${unreadCount === 1 ? 'alert' : 'alerts'}`
          : 'Alerts'
      }
    >
      <Bell className="w-5 h-5 text-foreground" />
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;
