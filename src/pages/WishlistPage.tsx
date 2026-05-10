import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,

} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/utils';
import { wishlistService } from '@/services/wishlist';
import { useApi } from '@/hooks/useApi';
import type { WishlistItem, PaginatedData } from '@/types';

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { addToCart } = useCartStore();

  const {
    data: wishlistData,
    loading,
    execute: fetchWishlist,
  } = useApi<PaginatedData<WishlistItem>>((...args: unknown[]) => wishlistService.getWishlist());

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    if (wishlistData) {
      setWishlistItems(wishlistData.items || []);
    }
  }, [wishlistData]);

  const handleRemove = async (productId: number) => {
    try {
      await wishlistService.removeProduct(productId);
      setWishlistItems(items => items.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (item.product) {
      await addToCart(item.product, item.product.minimum_order_quantity || 1);
      handleRemove(item.product_id);
    }
  };

  const handleAddAllToCart = async () => {
    for (const item of wishlistItems.filter((i) => i.product && i.product.stock_quantity > 0)) {
      await handleAddToCart(item);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <Heart className="h-16 w-16 text-text-muted mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Your wishlist is empty</h2>
        <p className="text-text-secondary mb-6 text-center">
          Save items you like by clicking the heart icon
        </p>
        <Link to="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Wishlist</h1>
            <p className="text-text-muted">{wishlistItems.length} items saved</p>
          </div>
          <Button
            variant="outline"
            onClick={handleAddAllToCart}
            leftIcon={<ShoppingCart className="h-4 w-4" />}
          >
            Add All to Cart
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            item.product && (
              <Card key={item.id} className="group overflow-hidden">
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  <Link to={`/products/${item.product.id}`}>
                    <img
                      src={item.product.images?.[0]?.image_url || 'https://via.placeholder.com/400'}
                      alt={item.product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.product.stock_quantity === 0 && (
                      <Badge variant="error">Out of Stock</Badge>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-surface shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-light hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-medium text-text-primary hover:text-primary line-clamp-1"
                  >
                    {item.product.product_name}
                  </Link>
                  <p className="text-xs text-text-muted mt-1">{item.product.seller?.business_profile?.business_name || 'Unknown Supplier'}</p>

                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs text-text-muted">
                      {item.product.average_rating?.toFixed(1) || '0.0'} ({item.product.review_count || 0})
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(item.product.price)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">
                      Min. {item.product.minimum_order_quantity || 1} {item.product.unit || 'units'}
                    </p>
                  </div>

                  <Button
                    className="w-full mt-4"
                    size="sm"
                    disabled={item.product.stock_quantity === 0}
                    onClick={() => handleAddToCart(item)}
                    leftIcon={<ShoppingCart className="h-4 w-4" />}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
