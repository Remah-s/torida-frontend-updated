import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Truck,
  MapPin,
  ChevronRight,
  Plus,
  Check,
  ShoppingBag,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, cn } from '@/utils';
import { addressService } from '@/services/address';
import { governorateService } from '@/services/governorate';
import { useApi } from '@/hooks/useApi';
import type { Address, Governorate } from '@/types';

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Meeza' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const [selectedGovernorate] = useState<string>('Cairo');
  const [selectedPayment, setSelectedPayment] = useState<string>('cod');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    governorate: 'Cairo',
    phone: '',
  });

  const {
    execute: fetchAddresses,
  } = useApi<Address[]>(() => addressService.getAddresses());

  const {
    execute: fetchGovernorates,
  } = useApi<Governorate[]>(() => governorateService.getGovernorates());

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses().then(data => setAddresses(data || []));
      fetchGovernorates().then(data => setGovernorates(data || []));
    }
  }, [isAuthenticated, fetchAddresses, fetchGovernorates]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(a => a.is_default);
      setSelectedAddress(defaultAddr?.id || addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  const savedAddresses = addresses.map((addr) => ({
    id: addr.id,
    name: addr.label,
    address: addr.full_address,
    governorate: governorates.find((gov) => gov.id === addr.gov_id)?.gov_name || 'Unknown',
    phone: user?.phone || 'N/A',
    is_default: addr.is_default,
  }));

  const displayItems = items.map(item => ({
    ...item,
    product: {
      ...item.product,
      image: (item.product as any).images?.[0]?.image_url || 'https://via.placeholder.com/200',
    }
  }));

  const subtotal = displayItems.reduce((sum, item) => sum + item.total_price, 0);
  const shipping = subtotal > 5000 ? 0 : 50;
  const tax = Math.round(subtotal * 0.14); // 14% VAT
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('confirmation');
    } else {
      clearCart();
      navigate('/orders');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-text-muted mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Please Login to Checkout</h2>
        <p className="text-text-secondary mb-6 text-center">
          You need to be logged in to place an order
        </p>
        <Link to="/login?redirect=/checkout">
          <Button size="lg">Login to Continue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => step === 'payment' ? setStep('shipping') : navigate(-1)}
            className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Checkout</h1>
            <p className="text-text-muted text-sm">
              {step === 'shipping' && 'Shipping Information'}
              {step === 'payment' && 'Payment Method'}
              {step === 'confirmation' && 'Order Confirmation'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 max-w-md">
          <div className={cn(
            'flex-1 h-1 rounded-full',
            ['shipping', 'payment', 'confirmation'].includes(step) ? 'bg-primary' : 'bg-border'
          )} />
          <div className={cn(
            'flex-1 h-1 rounded-full',
            ['payment', 'confirmation'].includes(step) ? 'bg-primary' : 'bg-border'
          )} />
          <div className={cn(
            'flex-1 h-1 rounded-full',
            step === 'confirmation' ? 'bg-primary' : 'bg-border'
          )} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="space-y-6">
                {/* Saved Addresses */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">Delivery Address</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewAddress(!showNewAddress)}
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Add New
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={cn(
                          'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                          selectedAddress === addr.id
                            ? 'border-primary bg-primary-light'
                            : 'border-border hover:border-border-dark'
                        )}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-text-primary">{addr.name}</span>
                            {addr.is_default && (
                              <Badge variant="success" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-text-secondary">{addr.address}</p>
                          <p className="text-sm text-text-muted">{addr.governorate} • {addr.phone}</p>
                        </div>
                        {selectedAddress === addr.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </label>
                    ))}
                  </div>

                  {showNewAddress && (
                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                      <h3 className="font-medium text-text-primary">New Address</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="Address Name"
                          placeholder="e.g., Store, Warehouse"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        />
                        <Input
                          label="Phone Number"
                          placeholder="+20 xxx xxx xxxx"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        />
                      </div>
                      <Input
                        label="Full Address"
                        placeholder="Street, Building, Floor"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Governorate
                        </label>
                        <select
                          value={newAddress.governorate}
                          onChange={(e) => setNewAddress({ ...newAddress, governorate: e.target.value })}
                          className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {governorates.map((gov) => (
                            <option key={gov.id} value={gov.gov_name}>{gov.gov_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Delivery Options */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">Delivery Options</h2>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-border-dark cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-text-primary">Standard Delivery</p>
                          <p className="text-sm text-text-muted">2-3 business days</p>
                        </div>
                      </div>
                      <span className="font-semibold text-text-primary">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-border-dark cursor-pointer opacity-50">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-text-muted" />
                        <div>
                          <p className="font-medium text-text-primary">Express Delivery</p>
                          <p className="text-sm text-text-muted">Same day (Coming soon)</p>
                        </div>
                      </div>
                      <span className="font-semibold text-text-muted">+{formatCurrency(100)}</span>
                    </label>
                  </div>
                </Card>
              </div>
            )}

            {step === 'payment' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                        selectedPayment === method.id
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-border-dark'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{method.name}</p>
                        <p className="text-sm text-text-muted">{method.description}</p>
                      </div>
                      {selectedPayment === method.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </label>
                  ))}
                </div>

                {selectedPayment === 'card' && (
                  <div className="mt-6 pt-6 border-t border-border space-y-4">
                    <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry Date" placeholder="MM/YY" />
                      <Input label="CVV" placeholder="123" />
                    </div>
                    <Input label="Cardholder Name" placeholder="Name on card" />
                  </div>
                )}

                {selectedPayment === 'bank' && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="bg-info-light rounded-lg p-4">
                      <p className="font-medium text-info mb-2">Bank Transfer Details</p>
                      <div className="text-sm text-info space-y-1">
                        <p>Bank: National Bank of Egypt</p>
                        <p>Account: 1234567890</p>
                        <p>IBAN: EGXX XXXX XXXX XXXX XXXX XXXX</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {step === 'confirmation' && (
              <Card className="p-6 text-center">
                <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-10 w-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Order Placed Successfully!</h2>
                <p className="text-text-secondary mb-6">
                  Your order #ORD-2024-001234 has been confirmed and will be delivered soon.
                </p>
                <div className="bg-surface-elevated rounded-xl p-4 text-left mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-text-primary">Estimated Delivery</p>
                      <p className="text-sm text-text-muted">January 20, 2024 - January 22, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-text-primary">Delivery Address</p>
                      <p className="text-sm text-text-muted">Main Store • 123 Tahrir Street, Cairo</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to="/orders" className="flex-1">
                    <Button className="w-full">View Orders</Button>
                  </Link>
                  <Link to="/products" className="flex-1">
                    <Button variant="outline" className="w-full">Continue Shopping</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {displayItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product.image || 'https://via.placeholder.com/60'}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <span className="font-medium text-text-primary text-sm">
                        {formatCurrency(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Shipping</span>
                    <span className={shipping === 0 ? 'text-success font-medium' : 'font-medium'}>
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">VAT (14%)</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold text-text-primary">Total</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  rightIcon={<ChevronRight className="h-5 w-5" />}
                >
                  {step === 'shipping' && 'Continue to Payment'}
                  {step === 'payment' && 'Place Order'}
                  {step === 'confirmation' && 'Go to Orders'}
                </Button>

                <p className="text-xs text-text-muted text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
