import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  Plus,
  BarChart3,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  Truck,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Badge, Card, CardContent, ProgressBar } from '@/components/ui';
import { orderService } from '@/services/order';
import { productService } from '@/services/product';

const SupplierDashboardPage: React.FC = () => {
  const [stats, setStats] = React.useState([
    { label: 'Total Revenue', value: 'E£0', change: '0%', changeType: 'neutral', icon: DollarSign, color: 'teal' },
    { label: 'Total Orders', value: '0', change: '0', changeType: 'neutral', icon: ShoppingCart, color: 'primary' },
    { label: 'Active Products', value: '0', change: '0', changeType: 'neutral', icon: Package, color: 'info' },
    { label: 'Customers', value: '0', change: '0', changeType: 'neutral', icon: Users, color: 'success' },
  ]);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [topProducts, setTopProducts] = React.useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = React.useState<any[]>([]);
  const [revenueData, setRevenueData] = React.useState<any[]>([
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
  ]);

  React.useEffect(() => {
    orderService.getOrders({ per_page: 5 }).then((result) => {
      const orders = Array.isArray(result?.items) ? result.items : [];
      setRecentOrders(orders);
      const totalRevenue = orders.reduce((acc: number, o: any) => acc + (parseFloat(o.total_amount) || 0), 0);
      const customers = new Set(orders.map((o: any) => o.retailer_id)).size;

      setStats((prev) => [
        { ...prev[0], value: `E£${totalRevenue}` },
        { ...prev[1], value: String(result?.pagination?.total_items || orders.length) },
        prev[2],
        { ...prev[3], value: String(customers) },
      ]);
    }).catch((err) => {
      console.error('[SupplierDashboard] Failed to load orders:', err);
    });

    productService.getProducts({ per_page: 100 }).then((response) => {
      const prods = Array.isArray(response?.items) ? response.items : [];
      setTopProducts(prods.slice(0, 3));
      setLowStockProducts(prods.filter((p: any) => p.stock_quantity < 50).slice(0, 3));
      setStats((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], value: String(prods.filter((p: any) => p.is_active).length) },
        prev[3],
      ]);
    }).catch((err) => {
      console.error('[SupplierDashboard] Failed to load products:', err);
    });
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

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Accept Order', color: 'teal' };
      case 'processing': return { label: 'Mark Shipped', color: 'info' };
      case 'shipped': return { label: 'Track', color: 'outline' };
      default: return { label: 'View', color: 'outline' };
    }
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue)) || 1000;

  return (
    <DashboardLayout type="supplier">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal to-teal-light rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Supplier Dashboard</h2>
            <p className="text-white/80">Manage your products, track orders, and grow your business.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/supplier/analytics">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" leftIcon={<BarChart3 className="h-4 w-4" />}>
                View Analytics
              </Button>
            </Link>
            <Link to="/dashboard/supplier/products/add">
              <Button className="bg-white text-teal hover:bg-gray-100 shadow-lg" leftIcon={<Plus className="h-4 w-4" />}>
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'teal' ? 'bg-teal-light/20' :
                  stat.color === 'primary' ? 'bg-primary-light' :
                  stat.color === 'info' ? 'bg-info-light' :
                  'bg-success-light'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'teal' ? 'text-teal' :
                    stat.color === 'primary' ? 'text-primary' :
                    stat.color === 'info' ? 'text-info' :
                    'text-success'
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
                <Link to="/dashboard/supplier/orders">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center text-text-muted py-4">No recent orders</div>
                ) : recentOrders.map((order) => {
                  const statusAction = getStatusActions(order.status);
                  return (
                    <div
                      key={order.id}
                      className="p-4 bg-surface-elevated rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-teal-light/20 flex items-center justify-center">
                            <Package className="h-5 w-5 text-teal" />
                          </div>
                          <div>
                            <Link to={`/dashboard/supplier/orders/${order.id}`} className="font-semibold text-teal hover:underline">
                              ORD-{order.id}
                            </Link>
                            <p className="text-sm text-text-muted">Retailer ID: {order.retailer_id}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(order.status)} className="capitalize">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>{order.items?.length || 0} items</span>
                          <span>•</span>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-text-primary">E£{order.total_amount}</span>
                          {order.status !== 'delivered' && (
                            <Button size="sm" variant="teal">
                              {statusAction.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Top Selling Products</h2>
                <Link to="/dashboard/supplier/products">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <div className="text-center text-text-muted py-4">No products found</div>
                ) : topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-surface-elevated rounded-xl hover:shadow-md transition-all duration-300">
                    {product.images?.[0]?.image_url ? (
                      <img
                        src={product.images[0].image_url}
                        alt={product.product_name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-surface-elevated border flex items-center justify-center">
                        <Package className="h-6 w-6 text-text-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{product.product_name}</div>
                      <div className="flex items-center gap-3 text-sm text-text-muted">
                        <span>{product.stock_quantity} in stock</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-teal">E£{product.price}</div>
                      <div className="text-xs text-text-muted">price</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Chart (Simple) */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Revenue Overview</h2>
                <select className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-teal">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="flex items-end justify-between gap-2 h-48">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-teal to-teal-light rounded-t-lg transition-all duration-300 hover:from-teal-light hover:to-teal"
                      style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                    <span className="text-xs text-text-muted mt-2">{data.month}</span>
                    <span className="text-xs font-medium text-teal">
                      E£{(data.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/dashboard/supplier/products/add" className="block">
                  <div className="flex items-center gap-3 p-4 bg-surface-elevated rounded-xl hover:bg-teal-light/30 transition-colors group">
                    <div className="h-10 w-10 rounded-lg bg-teal-light/20 flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors">
                      <Plus className="h-5 w-5 text-teal group-hover:text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Add New Product</div>
                      <div className="text-xs text-text-muted">Expand your catalog</div>
                    </div>
                  </div>
                </Link>
                <Link to="/dashboard/supplier/orders" className="block">
                  <div className="flex items-center gap-3 p-4 bg-surface-elevated rounded-xl hover:bg-teal-light/30 transition-colors group">
                    <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ShoppingCart className="h-5 w-5 text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Manage Orders</div>
                      <div className="text-xs text-text-muted">2 pending orders</div>
                    </div>
                  </div>
                </Link>
                <Link to="/dashboard/supplier/analytics" className="block">
                  <div className="flex items-center gap-3 p-4 bg-surface-elevated rounded-xl hover:bg-teal-light/30 transition-colors group">
                    <div className="h-10 w-10 rounded-lg bg-info-light flex items-center justify-center group-hover:bg-info transition-colors">
                      <BarChart3 className="h-5 w-5 text-info group-hover:text-white" />
                    </div>
                    <div>
                      <div className="font-medium">View Analytics</div>
                      <div className="text-xs text-text-muted">Sales & insights</div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Store Rating */}
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-4">Store Rating</h2>
              <div className="text-5xl font-bold text-teal mb-2">4.8</div>
              <div className="flex justify-center mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i <= 4 ? 'fill-warning text-warning' : i === 5 ? 'fill-warning text-warning opacity-80' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-text-muted">Based on 256 reviews</p>
              <Link to="/profile" className="block mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View All Reviews
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-warning">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <h2 className="text-lg font-semibold">Low Stock Alert</h2>
              </div>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <div className="text-center text-text-muted py-4 text-sm">Stock levels look good</div>
                ) : lowStockProducts.map((product, index) => (
                  <div key={index} className="p-3 bg-warning-light rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{product.product_name}</span>
                      <Badge variant="warning">{product.stock_quantity} left</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warning rounded-full"
                          style={{ width: `${Math.min((product.stock_quantity / 50) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted">
                        {product.stock_quantity}/50
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/supplier/products" className="block mt-4">
                <Button variant="warning" size="sm" className="w-full">
                  Restock Products
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Store Views */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-teal" />
                <h2 className="text-lg font-semibold">Store Views</h2>
              </div>
              <div className="text-4xl font-bold text-teal mb-2">1,284</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-success">+15%</span>
                <span className="text-text-muted">vs last week</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierDashboardPage;
