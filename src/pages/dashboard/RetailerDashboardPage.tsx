import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  TrendingUp,
  ArrowRight,
  Star,
  DollarSign,
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { orderService } from '@/services/order';
import { userService } from '@/services/user';

const RetailerDashboardPage: React.FC = () => {
  const [stats, setStats] = React.useState([
    { label: 'Total Orders', value: '0', change: '0%', changeType: 'neutral', icon: ShoppingCart, color: 'primary' },
    { label: 'Total Spent', value: 'E£0', change: '0%', changeType: 'neutral', icon: DollarSign, color: 'teal' },
    { label: 'Active Suppliers', value: '0', change: '0', changeType: 'neutral', icon: Users, color: 'info' },
    { label: 'Pending Payments', value: 'E£0', change: '0 orders', changeType: 'neutral', icon: CreditCard, color: 'warning' },
  ]);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [topSuppliers, setTopSuppliers] = React.useState<any[]>([]);
  const [pendingActions, setPendingActions] = React.useState<any[]>([]);
  const [orderTimeline, setOrderTimeline] = React.useState<any[]>([]);

  React.useEffect(() => {
    orderService.getOrders({ per_page: 5 }).then((result) => {
      const orders = result.items || [];
      setRecentOrders(orders);
      setStats([
        { label: 'Total Orders', value: String(result.pagination.total_items || 0), change: 'Active', changeType: 'positive', icon: ShoppingCart, color: 'primary' },
        { label: 'Total Spent', value: `E£${orders.reduce((acc: number, o: any) => acc + (parseFloat(o.total_amount) || 0), 0)}`, change: 'Current', changeType: 'neutral', icon: DollarSign, color: 'teal' },
        { label: 'Active Suppliers', value: String(new Set(orders.map((o: any) => o.supplier_id)).size), change: 'Unique', changeType: 'positive', icon: Users, color: 'info' },
        { label: 'Pending Payments', value: 'E£0', change: '0 orders', changeType: 'neutral', icon: CreditCard, color: 'warning' },
      ]);
    }).catch(console.error);

    userService.getUsers({ type_id: 1, per_page: 3 }).then((result) => {
      setTopSuppliers(result.items || []);
    }).catch(console.error);
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout type="retailer">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-white/80">Here's what's happening with your business today.</p>
          </div>
          <Link to="/products">
            <Button className="bg-white text-primary hover:bg-gray-100 shadow-lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary-light' :
                  stat.color === 'teal' ? 'bg-teal-light/20' :
                  stat.color === 'info' ? 'bg-info-light' :
                  'bg-warning-light'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'primary' ? 'text-primary' :
                    stat.color === 'teal' ? 'text-teal' :
                    stat.color === 'info' ? 'text-info' :
                    'text-warning'
                  }`} />
                </div>
                <Badge 
                  variant={stat.changeType === 'positive' ? 'success' : stat.changeType === 'negative' ? 'error' : 'outline'} 
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <Link to="/dashboard/retailer/orders">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center text-text-muted py-4">No recent orders found</div>
                ) : recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/dashboard/retailer/orders/${order.id}`}
                    className="block p-4 bg-surface-elevated rounded-xl hover:bg-primary-light/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">ORD-{order.id}</span>
                          <Badge variant={getStatusColor(order.status)} className="capitalize text-xs">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-muted mt-1">Supplier ID: {order.supplier_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">E£{order.total_amount}</p>
                        <p className="text-xs text-text-muted">{order.items?.length || 0} items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link to="/products" className="group">
                  <div className="p-4 bg-surface-elevated rounded-xl border border-transparent group-hover:border-primary group-hover:bg-primary-light/20 transition-all duration-300">
                    <Package className="h-8 w-8 text-primary mb-3" />
                    <div className="font-medium">Browse Products</div>
                    <div className="text-xs text-text-muted">Find new products</div>
                  </div>
                </Link>
                <Link to="/dashboard/retailer/orders" className="group">
                  <div className="p-4 bg-surface-elevated rounded-xl border border-transparent group-hover:border-primary group-hover:bg-primary-light/20 transition-all duration-300">
                    <ShoppingCart className="h-8 w-8 text-primary mb-3" />
                    <div className="font-medium">My Orders</div>
                    <div className="text-xs text-text-muted">Track & manage</div>
                  </div>
                </Link>
                <Link to="/rfq" className="group">
                  <div className="p-4 bg-surface-elevated rounded-xl border border-transparent group-hover:border-primary group-hover:bg-primary-light/20 transition-all duration-300">
                    <TrendingUp className="h-8 w-8 text-primary mb-3" />
                    <div className="font-medium">Request Quote</div>
                    <div className="text-xs text-text-muted">Get best prices</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Pending Actions</h2>
              <div className="space-y-3">
                {pendingActions.length === 0 ? (
                  <div className="text-center text-text-muted py-4">No pending actions</div>
                ) : pendingActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-start gap-3 p-3 bg-surface-elevated rounded-xl hover:bg-primary-light/30 transition-colors group"
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      action.color === 'warning' ? 'bg-warning-light' :
                      action.color === 'error' ? 'bg-error-light' :
                      'bg-info-light'
                    }`}>
                      {/* action.icon isn't safely renderable from state without mapping */}
                      <Star className={`h-5 w-5 ${
                        action.color === 'warning' ? 'text-warning' :
                        action.color === 'error' ? 'text-error' :
                        'text-info'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.message}</p>
                      <span className="text-xs text-primary font-medium">{action.action} →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Suppliers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Top Suppliers</h2>
                <Link to="/suppliers">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {topSuppliers.length === 0 ? (
                  <div className="text-center text-text-muted py-4">No top suppliers found</div>
                ) : topSuppliers.map((supplier, index) => (
                  <Link
                    key={index}
                    to={`/suppliers/${supplier.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded-xl transition-colors"
                  >
                    {supplier.business_profile?.logo_url ? (
                      <img
                        src={supplier.business_profile.logo_url}
                        alt={supplier.full_name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-surface-elevated border flex items-center justify-center">
                        <Users className="h-6 w-6 text-text-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{supplier.business_profile?.company_name || supplier.full_name}</div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>{supplier.location || 'N/A'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {supplier.business_profile?.average_rating || '0.0'}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {supplier.business_profile?.review_count || 0} reviews
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Activity */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {orderTimeline.length === 0 ? (
                  <div className="text-center text-text-muted py-4">No recent activity</div>
                ) : orderTimeline.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface-elevated rounded-xl">
                    <div>
                      <div className="font-medium">{day.date}</div>
                      <div className="text-xs text-text-muted">{day.orders} orders</div>
                    </div>
                    <div className="font-semibold text-primary">{day.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RetailerDashboardPage;
