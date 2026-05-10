import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const orderData = {
  id: 'ORD-1234',
  status: 'processing',
  createdAt: '2024-01-15 10:30 AM',
  buyer: {
    name: 'Cairo Supermarket',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
    phone: '+20 10 1234 5678',
    email: 'orders@cairosupermarket.com',
  },
  items: [
    { id: 1, name: 'Organic Rice Premium', quantity: 50, unit: 'kg', price: 380, total: 19000 },
    { id: 2, name: 'Basmati Rice Extra Long', quantity: 30, unit: 'kg', price: 450, total: 13500 },
  ],
  subtotal: 32500,
  shipping: 500,
  total: 33000,
  shippingAddress: {
    recipient: 'Ahmed Hassan',
    phone: '+20 10 1234 5678',
    address: '123 Main Street, Nasr City',
    governorate: 'Cairo',
  },
  paymentMethod: 'Bank Transfer',
  paymentStatus: 'paid',
  notes: 'Please deliver before 2 PM',
};

const SupplierOrderDetailPage: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'outline';
      case 'cancelled': return 'error';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard/supplier/orders">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Orders
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{orderData.id}</h1>
              <Badge variant={getStatusColor(orderData.status)} className="capitalize">
                {orderData.status}
              </Badge>
            </div>
            <p className="text-text-muted">Placed on {orderData.createdAt}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />}>
              Contact Buyer
            </Button>
            <Button leftIcon={<CheckCircle className="h-4 w-4" />}>
              Process Order
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Product</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Quantity</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Unit Price</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items.map((item) => (
                        <tr key={item.id} className="border-b border-border">
                          <td className="py-3 px-2">
                            <div className="font-medium">{item.name}</div>
                          </td>
                          <td className="py-3 px-2">{item.quantity} {item.unit}</td>
                          <td className="py-3 px-2">E£{item.price}</td>
                          <td className="py-3 px-2 text-right font-medium">E£{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {orderData.notes && (
                  <div className="mt-4 p-3 bg-surface-elevated rounded-lg">
                    <p className="text-sm font-medium">Buyer Notes:</p>
                    <p className="text-sm text-text-muted">{orderData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fulfillment Actions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Fulfillment Actions</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Button className="h-auto py-4 flex-col" variant="outline">
                    <CheckCircle className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Confirm</span>
                    <span className="text-xs">Accept order</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col" variant="outline">
                    <Package className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Process</span>
                    <span className="text-xs">Prepare items</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col">
                    <Truck className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Ship</span>
                    <span className="text-xs">Mark as shipped</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span>E£{orderData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Shipping</span>
                    <span>E£{orderData.shipping.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary text-lg">E£{orderData.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Buyer</h2>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={orderData.buyer.logo}
                    alt={orderData.buyer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{orderData.buyer.name}</p>
                    <p className="text-sm text-text-muted">{orderData.buyer.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">View Profile</Button>
                  <Button variant="outline" className="flex-1" size="sm">Message</Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{orderData.shippingAddress.recipient}</p>
                  <p className="text-text-muted">{orderData.shippingAddress.address}</p>
                  <p className="text-text-muted">{orderData.shippingAddress.governorate}</p>
                  <p className="flex items-center gap-2 mt-2">
                    <Phone className="h-4 w-4 text-text-muted" />
                    {orderData.shippingAddress.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Payment</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Method</span>
                    <span>{orderData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status</span>
                    <Badge variant="success">{orderData.paymentStatus}</Badge>
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

export default SupplierOrderDetailPage;
