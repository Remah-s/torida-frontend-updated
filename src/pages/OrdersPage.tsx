import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  Search,
  Eye,
  Download,
  Calendar,
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { formatCurrency, cn } from '@/utils';
import { orderService } from '@/services/order';
import { useApi } from '@/hooks/useApi';
import type { Order, OrderStatus, PaginatedData } from '@/types';

const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string; icon: string }> = {
  pending: { bg: 'bg-warning-light', text: 'text-warning', label: 'Pending', icon: '...' },
  confirmed: { bg: 'bg-info-light', text: 'text-info', label: 'Confirmed', icon: 'i' },
  processing: { bg: 'bg-warning-light', text: 'text-warning', label: 'Processing', icon: '...' },
  shipped: { bg: 'bg-info-light', text: 'text-info', label: 'Shipped', icon: '->' },
  out_for_delivery: { bg: 'bg-info-light', text: 'text-info', label: 'Out for Delivery', icon: '->' },
  delivered: { bg: 'bg-success-light', text: 'text-success', label: 'Delivered', icon: 'ok' },
  cancelled: { bg: 'bg-error-light', text: 'text-error', label: 'Cancelled', icon: 'x' },
};

const filterTabs: Array<{ key: 'all' | OrderStatus; label: string }> = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterStatus = (searchParams.get('status') || 'all') as 'all' | OrderStatus;

  const [orders, setOrders] = useState<Order[]>([]);

  const {
    data: ordersData,
    execute: fetchOrders,
  } = useApi<PaginatedData<Order>>((...args: unknown[]) => orderService.getOrders(args[0] as any));

  useEffect(() => {
    fetchOrders({});
  }, [fetchOrders]);

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData.items || []);
    }
  }, [ordersData]);

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const statusCounts = filterTabs.reduce<Record<string, number>>((counts, tab) => {
    counts[tab.key] = tab.key === 'all'
      ? orders.length
      : orders.filter((order) => order.status === tab.key).length;
    return counts;
  }, {});

  const handleFilterChange = (status: 'all' | OrderStatus) => {
    const nextParams = new URLSearchParams(searchParams);
    if (status === 'all') {
      nextParams.delete('status');
    } else {
      nextParams.set('status', status);
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Orders</h1>
            <p className="text-text-muted">Track and manage your orders</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="search"
                placeholder="Search orders..."
                className="h-10 w-64 rounded-xl border border-border bg-surface pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={cn(
                'shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                filterStatus === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-border-dark'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'ml-2 rounded-full px-2 py-0.5 text-xs',
                  filterStatus === tab.key ? 'bg-white/20' : 'bg-surface-elevated'
                )}
              >
                {statusCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No orders found</h3>
              <p className="text-text-muted mb-6">
                {filterStatus === 'all'
                  ? "You haven't placed any orders yet"
                  : `No ${filterStatus.replace('_', ' ')} orders`}
              </p>
              {filterStatus === 'all' && (
                <Link to="/products">
                  <Button>Start Shopping</Button>
                </Link>
              )}
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="p-0 overflow-hidden">
                <div className="flex flex-col gap-3 justify-between p-4 bg-surface-elevated border-b border-border md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center">
                      <Package className="h-5 w-5 text-text-muted" />
                    </div>
                    <div>
                      <Link
                        to={`/orders/${order.id}`}
                        className="font-semibold text-text-primary hover:text-primary"
                      >
                        {order.custom_id || `Order #${order.id}`}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Calendar className="h-3 w-3" />
                        <span>{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</span>
                        <span>-</span>
                        <span>{order.items?.length || 0} items</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusConfig[order.status].bg}>
                      <span className={statusConfig[order.status].text}>
                        {statusConfig[order.status].icon} {statusConfig[order.status].label}
                      </span>
                    </Badge>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
                    <div>
                      <p className="text-sm text-text-muted mb-1">Supplier</p>
                      <p className="font-medium text-text-primary">
                        {order.seller?.business_profile?.business_name || 'Unknown Supplier'}
                      </p>
                    </div>
                    {order.delivery_date && (
                      <div>
                        <p className="text-sm text-text-muted mb-1">
                          {order.status === 'delivered' ? 'Delivered on' : 'Expected delivery'}
                        </p>
                        <p className="font-medium text-text-primary">{order.delivery_date}</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-text-muted mb-1">Total</p>
                      <p className="font-bold text-xl text-primary">{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                </div>

                {order.status === 'delivered' && (
                  <div className="px-4 pb-4 flex gap-2">
                    <Button variant="outline" size="sm">Reorder</Button>
                    <Button variant="ghost" size="sm">Leave Review</Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-text-muted">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
