import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Heart,
  Clock,
  TrendingUp,
  ChevronRight,
  Store,
  Bell,
  Settings,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { usePermission } from '@/hooks/usePermission';
import { formatCurrency } from '@/utils';
import { orderService } from '@/services/order';
import { notificationService } from '@/services/notification';
import { useApi } from '@/hooks/useApi';
import type { Order, PaginatedData, Notification } from '@/types';

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  delivered: { bg: 'bg-success-light', text: 'text-success', label: 'Delivered' },
  in_transit: { bg: 'bg-info-light', text: 'text-info', label: 'In Transit' },
  processing: { bg: 'bg-warning-light', text: 'text-warning', label: 'Processing' },
  cancelled: { bg: 'bg-error-light', text: 'text-error', label: 'Cancelled' },
};

const quickActions = [
  { icon: ShoppingBag, label: 'Browse Products', href: '/products', color: 'bg-primary-light text-primary' },
  { icon: Package, label: 'My Orders', href: '/orders', color: 'bg-info-light text-info' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist', color: 'bg-error-light text-error' },
  { icon: Settings, label: 'Settings', href: '/settings', color: 'bg-surface-elevated text-text-secondary' },
];

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { isSeller, isAdmin, dashboardPath } = usePermission();

  // ── Role-based redirect ────────────────────────────────────
  // Sellers → /dashboard/supplier, Admins → /admin
  // Buyers stay here OR go to /dashboard/retailer
  if (isAuthenticated && (isSeller || isAdmin)) {
    return <Navigate to={dashboardPath} replace />;
  }

  const {
    data: ordersData,
    loading: ordersLoading,
    execute: fetchOrders,
  } = useApi<PaginatedData<Order>>((...args: unknown[]) => orderService.getOrders({ page: 1, per_page: 5 }));

  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  useEffect(() => {
    notificationService.getNotifications(1, 5).then((result) => {
      setNotifications(result.items || []);
    }).catch(() => {
      setNotifications([]);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <Store className="h-16 w-16 text-text-muted mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome to Torida</h2>
        <p className="text-text-secondary mb-6 text-center">
          Login to access your dashboard and manage your orders
        </p>
        <div className="flex gap-3">
          <Link to="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-dark to-teal rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.full_name || 'User'}!
              </h1>
              <p className="text-gray-300">
                {user?.type_id === 1 
                  ? 'Ready to stock your shelves with quality products?'
                  : 'Manage your products and reach more customers'}
              </p>
            </div>
            <Link to="/products">
              <Button className="bg-white text-dark hover:bg-gray-100">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <p className="font-medium text-text-primary">{action.label}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-text-primary">{ordersData?.pagination?.total_items || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-success mt-2">Active</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(
                  (Array.isArray(ordersData?.items) ? ordersData.items : []).reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0)
                )}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success-light flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="text-xs text-success mt-2">Current Page Only</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-text-primary">
                  {(Array.isArray(ordersData?.items) ? ordersData.items : []).filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning-light flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
            <p className="text-xs text-warning mt-2">To be processed</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Wishlist Items</p>
                <p className="text-2xl font-bold text-text-primary">0</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-error-light flex items-center justify-center">
                <Heart className="h-6 w-6 text-error" />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">Coming soon</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">Recent Orders</h2>
                <Link to="/orders">
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
              <div className="divide-y divide-border">
                {(Array.isArray(ordersData?.items) ? ordersData.items : []).map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="flex items-center justify-between p-4 hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-surface-elevated flex items-center justify-center">
                        <Package className="h-5 w-5 text-text-muted" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{order.custom_id || `Order #${order.id}`}</p>
                        <p className="text-sm text-text-muted">{order.items?.length || 0} items • {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">{formatCurrency(order.total_amount)}</p>
                      <Badge className={statusColors[order.status]?.bg || 'bg-gray-100'}>
                        <span className={statusColors[order.status]?.text || 'text-gray-600'}>
                          {statusColors[order.status]?.label || order.status}
                        </span>
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">Notifications</h3>
                <Bell className="h-5 w-5 text-text-muted" />
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-sm text-text-muted text-center py-4">No new notifications</div>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="flex gap-3 p-2 bg-primary-light rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-text-primary">{n.message || 'Notification'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Help & Support */}
            <Card className="p-4">
              <h3 className="font-semibold text-text-primary mb-4">Help & Support</h3>
              <div className="space-y-2">
                <Link to="/help" className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded-lg transition-colors">
                  <HelpCircle className="h-5 w-5 text-text-muted" />
                  <span className="text-sm text-text-primary">Help Center</span>
                </Link>
                <Link to="/faq" className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded-lg transition-colors">
                  <FileText className="h-5 w-5 text-text-muted" />
                  <span className="text-sm text-text-primary">FAQs</span>
                </Link>
                <Link to="/contact" className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded-lg transition-colors">
                  <Bell className="h-5 w-5 text-text-muted" />
                  <span className="text-sm text-text-primary">Contact Us</span>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
