import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Package,
  ShoppingCart,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Filter,
  Check,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Badge, Card, CardContent } from '@/components/ui';

interface Notification {
  id: string;
  type: 'order' | 'stock' | 'review' | 'system' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

const notificationsData: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Cairo Supermarket placed an order for 50kg of Organic Rice Premium',
    time: '5 minutes ago',
    read: false,
    action: { label: 'View Order', href: '/dashboard/supplier/orders/1234' },
  },
  {
    id: '2',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Organic Rice Premium is running low (15 units remaining)',
    time: '1 hour ago',
    read: false,
    action: { label: 'Restock', href: '/dashboard/supplier/products' },
  },
  {
    id: '3',
    type: 'review',
    title: 'New 5-Star Review',
    message: 'Delta Mart left a 5-star review for Basmati Rice Extra Long',
    time: '2 hours ago',
    read: false,
    action: { label: 'View Review', href: '/profile' },
  },
  {
    id: '4',
    type: 'order',
    title: 'Order Shipped',
    message: 'Order #ORD-1232 has been shipped to Giza Grocery',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received E£4,500 payment for order #ORD-1234',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Profile Verified',
    message: 'Congratulations! Your supplier profile has been verified',
    time: '1 day ago',
    read: true,
  },
  {
    id: '7',
    type: 'stock',
    title: 'Stock Updated',
    message: 'Your inventory has been updated successfully',
    time: '1 day ago',
    read: true,
  },
  {
    id: '8',
    type: 'order',
    title: 'Order Delivered',
    message: 'Order #ORD-1231 has been delivered to Alexandria Store',
    time: '2 days ago',
    read: true,
  },
];

const SupplierNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(notificationsData);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');
  const [selectedNotifications, setSelectedNotifications] = React.useState<string[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'stock': return AlertTriangle;
      case 'review': return Star;
      case 'payment': return TrendingUp;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-teal-light/20 text-teal';
      case 'stock': return 'bg-warning-light text-warning';
      case 'review': return 'bg-primary-light text-primary';
      case 'payment': return 'bg-success-light text-success';
      default: return 'bg-info-light text-info';
    }
  };

  // Safe filtered list — always an array
  const filteredNotifications: Notification[] = Array.isArray(notifications)
    ? filter === 'unread'
      ? notifications.filter((n) => !n?.read)
      : notifications
    : [];

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n?.read).length
    : 0;

  const toggleSelect = (id: string) => {
    setSelectedNotifications((prev) =>
      Array.isArray(prev)
        ? prev.includes(id)
          ? prev.filter((nId) => nId !== id)
          : [...prev, id]
        : [id]
    );
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n?.id ?? '').filter(Boolean));
    }
  };

  const handleMarkAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        selectedNotifications.includes(n.id) ? { ...n, read: true } : n
      )
    );
    setSelectedNotifications([]);
  };

  const handleDelete = () => {
    setNotifications((prev) =>
      prev.filter((n) => !selectedNotifications.includes(n.id))
    );
    setSelectedNotifications([]);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setSelectedNotifications([]);
  };

  return (
    <DashboardLayout type="supplier">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="text-text-muted">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/supplier/settings">
            <Button variant="ghost" leftIcon={<Settings className="h-4 w-4" />}>
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              {/* Filters & Actions */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-teal text-white'
                        : 'bg-surface-elevated text-text-secondary hover:bg-teal-light/20'
                      }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
                        ? 'bg-teal text-white'
                        : 'bg-surface-elevated text-text-secondary hover:bg-teal-light/20'
                      }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {selectedNotifications.length > 0 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Check className="h-4 w-4" />}
                        onClick={handleMarkAsRead}
                      >
                        Mark as Read
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  <button
                    onClick={selectAll}
                    className="text-sm text-teal hover:underline"
                  >
                    {selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0
                      ? 'Deselect all'
                      : 'Select all'}
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="divide-y divide-border">
                {filteredNotifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <Bell className="h-16 w-16 mx-auto text-text-muted/30 mb-4" />
                    <p className="text-text-muted">No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    if (!notification?.id) return null;
                    const Icon = getNotificationIcon(notification.type ?? 'system');
                    return (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 hover:bg-surface-elevated transition-colors ${!notification.read ? 'bg-teal-light/5' : ''
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => toggleSelect(notification.id)}
                          className="mt-1 h-4 w-4 rounded border-border text-teal focus:ring-teal"
                        />
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type ?? 'system')}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p
                                className={`font-medium ${!notification.read ? 'text-text-primary' : 'text-text-secondary'
                                  }`}
                              >
                                {notification.title ?? ''}
                              </p>
                              <p className="text-sm text-text-muted mt-1">
                                {notification.message ?? ''}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-teal flex-shrink-0 mt-2" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-text-muted">{notification.time ?? ''}</span>
                            {notification.action && (
                              <Link
                                to={notification.action.href}
                                className="text-xs text-teal font-medium hover:underline"
                              >
                                {notification.action.label} →
                              </Link>
                            )}
                          </div>
                        </div>
                        <button className="p-1 hover:bg-surface rounded-lg">
                          <MoreVertical className="h-4 w-4 text-text-muted" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-teal-light/20 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-teal" />
                    </div>
                    <span className="text-sm">Total</span>
                  </div>
                  <span className="font-semibold">{notifications.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Unread</span>
                  </div>
                  <span className="font-semibold">{unreadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-success-light flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-sm">Read</span>
                  </div>
                  <span className="font-semibold">{notifications.length - unreadCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">By Type</h2>
              <div className="space-y-3">
                {[
                  { type: 'order', label: 'Orders', icon: ShoppingCart, color: 'teal' },
                  { type: 'stock', label: 'Stock Alerts', icon: AlertTriangle, color: 'warning' },
                  { type: 'review', label: 'Reviews', icon: Star, color: 'primary' },
                  { type: 'payment', label: 'Payments', icon: TrendingUp, color: 'success' },
                ].map((item) => {
                  const count = notifications.filter((n) => n?.type === item.type).length;
                  return (
                    <div
                      key={item.type}
                      className="flex items-center justify-between p-3 bg-surface-elevated rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 text-${item.color}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Check className="h-4 w-4" />}
                  onClick={handleMarkAllRead}
                >
                  Mark All as Read
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-error hover:bg-error-light"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={handleClearAll}
                >
                  Clear All Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierNotificationsPage;