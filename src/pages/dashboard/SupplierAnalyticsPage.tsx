import React from 'react';

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Card, CardContent, Button, Badge } from '@/components/ui';

const stats = [
  { label: 'Total Revenue', value: 'E£285,400', change: '+18%', trend: 'up', icon: DollarSign },
  { label: 'Orders', value: '89', change: '+12%', trend: 'up', icon: ShoppingCart },
  { label: 'Avg Order Value', value: 'E£3,207', change: '+5%', trend: 'up', icon: TrendingUp },
  { label: 'Customers', value: '156', change: '+8%', trend: 'up', icon: Users },
];

const monthlyRevenue = [
  { month: 'Aug', revenue: 180000 },
  { month: 'Sep', revenue: 195000 },
  { month: 'Oct', revenue: 210000 },
  { month: 'Nov', revenue: 245000 },
  { month: 'Dec', revenue: 260000 },
  { month: 'Jan', revenue: 285400 },
];

const topProducts = [
  { name: 'Organic Rice Premium', sold: 450, revenue: 171000, growth: '+12%' },
  { name: 'Basmati Rice Extra Long', sold: 280, revenue: 126000, growth: '+8%' },
  { name: 'Egyptian Short Grain', sold: 180, revenue: 57600, growth: '-3%' },
  { name: 'Fresh Olive Oil', sold: 120, revenue: 33600, growth: '+15%' },
];

const topCustomers = [
  { name: 'Cairo Supermarket', orders: 15, spent: 'E£45,200' },
  { name: 'Delta Mart', orders: 12, spent: 'E£38,500' },
  { name: 'Giza Grocery', orders: 10, spent: 'E£32,100' },
  { name: 'Alexandria Store', orders: 8, spent: 'E£28,400' },
];

const SupplierAnalyticsPage: React.FC = () => {
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-text-muted">Track your business performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded-lg bg-teal-light flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-teal" />
                  </div>
                  <Badge variant={stat.trend === 'up' ? 'success' : 'error'} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Revenue Trend</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">6 Months</Button>
                    <Button variant="outline" size="sm">1 Year</Button>
                  </div>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-4">
                  {monthlyRevenue.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-teal-light rounded-t relative" style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
                          E£{(data.revenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <span className="text-xs text-text-muted mt-2">{data.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Top Products</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Product</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Units Sold</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Revenue</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-2 font-medium">{product.name}</td>
                          <td className="py-3 px-2">{product.sold}</td>
                          <td className="py-3 px-2">E£{product.revenue.toLocaleString()}</td>
                          <td className="py-3 px-2">
                            <span className={`flex items-center gap-1 ${product.growth.startsWith('+') ? 'text-success' : 'text-error'}`}>
                              {product.growth.startsWith('+') ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              {product.growth}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Customers */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Top Customers</h2>
                <div className="space-y-3">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{customer.name}</div>
                          <div className="text-xs text-text-muted">{customer.orders} orders</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{customer.spent}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Insights</h2>
                <div className="space-y-4">
                  <div className="p-3 bg-success-light rounded-lg">
                    <p className="text-sm text-success font-medium">Revenue is up 18%</p>
                    <p className="text-xs text-text-muted mt-1">Compared to last month</p>
                  </div>
                  <div className="p-3 bg-warning-light rounded-lg">
                    <p className="text-sm text-warning font-medium">Organic Rice trending</p>
                    <p className="text-xs text-text-muted mt-1">Best seller this month</p>
                  </div>
                  <div className="p-3 bg-primary-light rounded-lg">
                    <p className="text-sm text-primary font-medium">5 new customers</p>
                    <p className="text-xs text-text-muted mt-1">This week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierAnalyticsPage;
