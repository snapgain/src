import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  BellRing,
  Check,
  CheckCheck,
  X,
  Trash2,
  Filter,
  Search,
  Settings,
  ExternalLink,
  ArrowRight,
  Zap,
  AlertTriangle,
  Info,
  TrendingUp,
  Gift,
  CreditCard,
  TestTube
} from 'lucide-react';

function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    getNotificationsByType,
    getNotificationsByPriority,
    generatePersonalizedNotification
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (hours < 1) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'new_deal': return <TrendingUp className="h-4 w-4" />;
      case 'expiring_deal': return <AlertTriangle className="h-4 w-4" />;
      case 'personalized_offer': return <Zap className="h-4 w-4" />;
      case 'new_card': return <CreditCard className="h-4 w-4" />;
      case 'weekly_digest': return <Gift className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'unread') {
        filtered = filtered.filter(n => !n.read);
      } else {
        filtered = getNotificationsByType(activeTab);
      }
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.store && n.store.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(n => n.priority === filterPriority);
    }

    return filtered;
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
      }
    }
  };

  const getTabCounts = () => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      new_deal: getNotificationsByType('new_deal').length,
      expiring_deal: getNotificationsByType('expiring_deal').length,
      personalized_offer: getNotificationsByType('personalized_offer').length
    };
  };

  const tabCounts = getTabCounts();
  const filteredNotifications = getFilteredNotifications();

  return (
    <DashboardLayout
      title="🔔 Notifications"
      subtitle="Manage your alerts and stay updated with the latest deals"
      icon={{
        element: <Bell className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-blue-500 to-indigo-600"
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={generatePersonalizedNotification}
                className="flex items-center space-x-2"
              >
                <TestTube className="h-4 w-4" />
                <span>Test Notification</span>
              </Button>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Mark All Read ({unreadCount})</span>
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <BellRing className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unread</p>
                    <p className="text-2xl font-bold">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Deals</p>
                    <p className="text-2xl font-bold">{getNotificationsByType('new_deal').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Personalized</p>
                    <p className="text-2xl font-bold">{getNotificationsByType('personalized_offer').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Notifications List */}
          <div className="lg:col-span-3">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Notifications</CardTitle>
                    <div className="flex items-center space-x-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-64"
                        />
                      </div>

                      {/* Priority Filter */}
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-md"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="all">
                        All {tabCounts.all > 0 && <Badge variant="secondary" className="ml-1">{tabCounts.all}</Badge>}
                      </TabsTrigger>
                      <TabsTrigger value="unread">
                        Unread {tabCounts.unread > 0 && <Badge variant="secondary" className="ml-1">{tabCounts.unread}</Badge>}
                      </TabsTrigger>
                      <TabsTrigger value="new_deal">
                        New Deals {tabCounts.new_deal > 0 && <Badge variant="secondary" className="ml-1">{tabCounts.new_deal}</Badge>}
                      </TabsTrigger>
                      <TabsTrigger value="expiring_deal">
                        Expiring {tabCounts.expiring_deal > 0 && <Badge variant="secondary" className="ml-1">{tabCounts.expiring_deal}</Badge>}
                      </TabsTrigger>
                      <TabsTrigger value="personalized_offer">
                        Personal {tabCounts.personalized_offer > 0 && <Badge variant="secondary" className="ml-1">{tabCounts.personalized_offer}</Badge>}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          variants={itemVariants}
                          className="group"
                        >
                          <Card className={`transition-all duration-300 hover:shadow-md cursor-pointer ${!notification.read ? 'bg-blue-50/50 border-blue-200' : ''}`}>
                            <CardContent className="p-6" onClick={() => handleNotificationClick(notification)}>
                              <div className="flex items-start space-x-4">
                                {/* Icon */}
                                <div className={`w-12 h-12 bg-gradient-to-r ${notification.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
                                  {notification.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <h3 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                          {notification.title}
                                        </h3>
                                        {!notification.read && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                      </div>
                                      <p className="text-muted-foreground mb-3">
                                        {notification.message}
                                      </p>

                                      {/* Metadata */}
                                      <div className="flex items-center space-x-4 text-sm">
                                        <Badge 
                                          variant="outline" 
                                          className={`${getPriorityColor(notification.priority)} flex items-center space-x-1`}
                                        >
                                          {getTypeIcon(notification.type)}
                                          <span>{notification.priority}</span>
                                        </Badge>
                                        {notification.cashbackRate && (
                                          <Badge variant="secondary">
                                            {notification.cashbackRate}% cashback
                                          </Badge>
                                        )}
                                        <span className="text-muted-foreground">
                                          {formatTime(notification.timestamp)}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-2">
                                      {!notification.read && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                          }}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Action Button */}
                                  {notification.action && (
                                    <Button 
                                      size="sm" 
                                      className="mt-3 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white"
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
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No notifications found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery || filterPriority !== 'all' 
                            ? 'Try adjusting your filters or search terms'
                            : 'You\'re all caught up! New notifications will appear here.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Deals</p>
                        <p className="text-sm text-muted-foreground">Get notified about new offers</p>
                      </div>
                      <Switch
                        checked={settings.newDeals}
                        onCheckedChange={(checked) => updateSettings({ newDeals: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Expiring Deals</p>
                        <p className="text-sm text-muted-foreground">Alerts before deals expire</p>
                      </div>
                      <Switch
                        checked={settings.expiringDeals}
                        onCheckedChange={(checked) => updateSettings({ expiringDeals: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Personalized Offers</p>
                        <p className="text-sm text-muted-foreground">Tailored recommendations</p>
                      </div>
                      <Switch
                        checked={settings.personalizedOffers}
                        onCheckedChange={(checked) => updateSettings({ personalizedOffers: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-sm text-muted-foreground">Summary of your savings</p>
                      </div>
                      <Switch
                        checked={settings.weeklyDigest}
                        onCheckedChange={(checked) => updateSettings({ weeklyDigest: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Price Alerts</p>
                        <p className="text-sm text-muted-foreground">Track specific products</p>
                      </div>
                      <Switch
                        checked={settings.priceAlerts}
                        onCheckedChange={(checked) => updateSettings({ priceAlerts: checked })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/settings')}
                    >
                      Advanced Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default NotificationsPage;