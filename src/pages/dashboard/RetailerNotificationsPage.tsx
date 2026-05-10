import React from 'react';

import {
  Bell,
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  CheckCircle,
  Clock,
  Trash2,
} from 'lucide-react';
import { Button, Card, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

const notifications = {
  orders: [
    { id: 1, type: 'order', title: 'New Order Received', message: 'Order #ORD-1234 from Cairo Supermarket', time: '5 minutes ago', read: false },
    { id: 2, type: 'order', title: 'Order Shipped', message: 'Order #ORD-1230 has been shipped', time: '1 hour ago', read: false },
    { id: 3, type: 'order', title: 'Order Delivered', message: 'Order #ORD-1225 has been delivered', time: '3 hours ago', read: true },
  ],
  promotions: [
    { id: 4, type: 'promo', title: 'Flash Sale Opportunity', message: 'Promote your products in our upcoming flash sale', time: '2 hours ago', read: false },
    { id: 5, type: 'promo', title: 'Featured Supplier Program', message: 'You\'re eligible for featured placement', time: '1 day ago', read: true },
  ],
  system: [
    { id: 6, type: 'system', title: 'Payment Received', message: 'E£4,500 for order #ORD-1220', time: '4 hours ago', read: true },
    { id: 7, type: 'system', title: 'Low Stock Alert', message: 'Organic Rice Premium is running low (15 units)', time: '6 hours ago', read: false },
    { id: 8, type: 'system', title: 'New Review', message: 'Cairo Supermarket left a 5-star review', time: '1 day ago', read: true },
  ],
};

const RetailerNotificationsPage: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-5 w-5 text-primary" />;
      case 'promo': return <Star className="h-5 w-5 text-warning" />;
      case 'system': return <Bell className="h-5 w-5 text-teal" />;
      default: return <Bell className="h-5 w-5 text-text-muted" />;
    }
  };

  const renderNotificationList = (items: typeof notifications.orders) => (
    <div className="space-y-3">
      {items.map((notification) => (
        <Card
          key={notification.id}
          className={`${!notification.read ? 'border-l-4 border-l-primary bg-primary-light/30' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-sm text-text-muted">{notification.message}</p>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">{notification.time}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {!notification.read && (
                    <Button variant="ghost" size="sm">Mark as Read</Button>
                  )}
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const unreadCount = [...notifications.orders, ...notifications.promotions, ...notifications.system].filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-text-muted">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Mark All as Read</Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderNotificationList([...notifications.orders, ...notifications.promotions, ...notifications.system])}
          </TabsContent>

          <TabsContent value="orders">
            {renderNotificationList(notifications.orders)}
          </TabsContent>

          <TabsContent value="promotions">
            {renderNotificationList(notifications.promotions)}
          </TabsContent>

          <TabsContent value="system">
            {renderNotificationList(notifications.system)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RetailerNotificationsPage;
