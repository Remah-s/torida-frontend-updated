import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/utils';

interface DisplayItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    minimum_order_quantity: number;
    stock_quantity: number;
    unit: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
  } = useCartStore();
  
  const [couponCode, setCouponCode] = React.useState('');

  const displayItems: DisplayItem[] = items.flatMap((item) => {
    if (!item.product) {
      return [];
    }

    return [{
      id: item.id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      product: {
        id: item.product.id,
        name: item.product.name || item.product.product_name,
        price: item.product.price,
        image: item.product.images?.[0]?.image_url || 'https://via.placeholder.com/200',
        minimum_order_quantity: item.product.minimum_order_quantity || 1,
        stock_quantity: item.product.stock_quantity,
        unit: item.product.unit || 'unit',
      },
    }];
  });

  const subtotal = displayItems.reduce((sum, item) => sum + item.total_price, 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleApplyCoupon = async () => {
    if (couponCode.trim()) {
      await applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (displayItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="h-24 w-24 rounded-full bg-surface-elevated flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h2>
        <p className="text-text-secondary mb-6 text-center">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link to="/products">
          <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Shopping Cart</h1>
            <p className="text-text-muted">
              {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => clearCart()}
            className="text-error hover:bg-error-light"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {displayItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link to={`/products/${item.product.id}`} className="shrink-0">
                    <img
                      src={item.product.image || 'https://via.placeholder.com/120'}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  </Link>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-semibold text-text-primary hover:text-primary line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-text-muted mt-1">
                      Min. order: {item.product.minimum_order_quantity} {item.product.unit}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface-elevated transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface-elevated transition-colors disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">
                          {formatCurrency(item.total_price)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatCurrency(item.unit_price)} / {item.product.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 rounded-lg text-text-muted hover:text-error hover:bg-error-light flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      leftIcon={<Tag className="h-4 w-4" />}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Shipping</span>
                    {shipping === 0 ? (
                      <Badge variant="success">Free</Badge>
                    ) : (
                      <span className="font-medium">{formatCurrency(shipping)}</span>
                    )}
                  </div>
                  
                  {/* Discount */}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Discount</span>
                      <span className="font-medium text-success">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold text-text-primary">Total</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 5000 && (
                  <div className="bg-info-light rounded-lg p-3 text-sm text-info">
                    Add {formatCurrency(5000 - subtotal)} more for free shipping!
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping */}
                <Link to="/products">
                  <Button variant="ghost" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
