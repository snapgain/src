import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  BellRing,
  X, 
  Check,
  CheckCheck,
  ExternalLink,
  ArrowRight,
  Settings,
  Trash2
} from 'lucide-react';

function NotificationDropdown() {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours < 1) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.action) {
      if (notification.action.type === 'external_link') {
        window.open(notification.action.url, '_blank');
      } else if (notification.action.type === 'internal_link') {
        navigate(notification.action.url);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[500px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        <CheckCheck className="h-3 w-3 mr-1" />
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate('/notifications');
                        setIsOpen(false);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.slice(0, 8).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`w-10 h-10 bg-gradient-to-r ${notification.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
                            {notification.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority}
                                </Badge>
                                {notification.cashbackRate && (
                                  <Badge variant="secondary" className="text-xs">
                                    {notification.cashbackRate}%
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>

                            {/* Action Button */}
                            {notification.action && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="mt-2 text-xs h-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                {notification.action.text}
                                {notification.action.type === 'external_link' ? (
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                ) : (
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-1">No notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      You're all caught up! New deals and updates will appear here.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 8 && (
                <div className="p-3 border-t bg-gray-50">
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => {
                      navigate('/notifications');
                      setIsOpen(false);
                    }}
                  >
                    View all notifications
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;