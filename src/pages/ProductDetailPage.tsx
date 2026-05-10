import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Check,
  Store,
  MapPin,
  Package,
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { productService } from '@/services/product';
import { reviewService } from '@/services/review';



const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      productService.getProduct(id),
      reviewService.getProductReviews(Number(id), 1, 20),
      productService.getProducts({ per_page: 4 }),
    ]).then(([prod, reviewsResult, relatedResult]) => {
      setProduct(prod);
      setQuantity(prod?.minimum_order_quantity || 1);
      setReviews(reviewsResult.items || []);
      setRelatedProducts((relatedResult.items || []).filter((p: any) => p.id !== prod.id));
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const newQty = quantity + delta;
    if (newQty >= (product.minimum_order_quantity || 1) && newQty <= (product.stock_quantity || 100)) {
      setQuantity(newQty);
    }
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    const tier = (product.pricing_tiers || []).find(
      (t: any) => quantity >= t.min_qty && (!t.max_qty || quantity <= t.max_qty)
    );
    return tier ? tier.price : product.wholesale_price || product.price;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Breadcrumb */}
      <div className="bg-surface-elevated border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <Link to={`/categories/${product.category_id || ''}`} className="hover:text-primary">
              {product.category?.name || 'Category'}
            </Link>
            <span>/</span>
            <span className="text-text-primary">{product.product_name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-elevated mb-4">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[selectedImage]?.image_url}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">No Image</div>
              )}
              <Badge className="absolute top-4 left-4" variant="success">
                In Stock
              </Badge>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="outline">{product.category?.name || 'Category'}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {product.product_name}
            </h1>
            <p className="text-text-muted text-sm mb-4">{product.description_ar}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.average_rating || 0)
                        ? 'fill-warning text-warning'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold">{product.average_rating || 0}</span>
                <span className="text-text-muted">({reviews.length} reviews)</span>
              </div>
              <button className="flex items-center gap-1 text-text-muted hover:text-primary">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* Pricing Tiers */}
            {(product.pricing_tiers?.length > 0) && (
              <div className="bg-surface-elevated rounded-xl p-4 mb-6">
                <h3 className="font-semibold mb-3">Wholesale Pricing</h3>
                <div className="space-y-2">
                  {product.pricing_tiers.map((tier: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex justify-between items-center p-2 rounded-lg ${
                        quantity >= tier.min_qty && (!tier.max_qty || quantity <= tier.max_qty)
                          ? 'bg-primary-light'
                          : 'bg-surface'
                      }`}
                    >
                      <span className="text-sm">
                        {tier.min_qty}+ {product.unit_of_measure || 'unit'}
                        {tier.max_qty && ` - ${tier.max_qty} ${product.unit_of_measure || 'unit'}`}
                      </span>
                      <span className="font-bold text-primary">E£{tier.price}/{product.unit_of_measure || 'unit'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-10)}
                    className="p-2 hover:bg-surface-elevated transition-colors"
                    disabled={quantity <= (product.minimum_order_quantity || 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || (product.minimum_order_quantity || 1))}
                    className="w-20 text-center border-x border-border py-2"
                    min={product.minimum_order_quantity || 1}
                    max={product.stock_quantity || 100}
                  />
                  <button
                    onClick={() => handleQuantityChange(10)}
                    className="p-2 hover:bg-surface-elevated transition-colors"
                    disabled={quantity >= (product.stock_quantity || 100)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-text-muted">{product.unit_of_measure || 'unit'}</span>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-primary">
                E£{(getCurrentPrice() * quantity).toLocaleString()}
              </span>
              <span className="text-text-muted">
                (E£{getCurrentPrice()}/{product.unit_of_measure || 'unit'})
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button size="lg" className="flex-1" leftIcon={<ShoppingCart className="h-5 w-5" />}>
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                Request Quote
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-surface-elevated rounded-lg">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-xs text-text-muted">Fast Delivery</span>
              </div>
              <div className="text-center p-3 bg-surface-elevated rounded-lg">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-xs text-text-muted">Quality Guaranteed</span>
              </div>
              <div className="text-center p-3 bg-surface-elevated rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-xs text-text-muted">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        {product.supplier && (
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {product.supplier.business_profile?.logo_url ? (
                    <img
                      src={product.supplier.business_profile.logo_url}
                      alt={product.supplier.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface-elevated border flex items-center justify-center">
                      <Store className="h-6 w-6 text-text-muted" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{product.supplier.business_profile?.company_name || product.supplier.full_name}</h3>
                      {product.supplier.is_verified && (
                        <Badge variant="success" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        {product.supplier.business_profile?.average_rating || 0} ({product.supplier.business_profile?.review_count || 0} reviews)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {product.supplier.location || 'Egypt'}
                      </span>
                    </div>
                  </div>
                </div>
                <Link to={`/suppliers/${product.supplier.id}`}>
                  <Button variant="outline">View Store</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.review_count})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description">
            <Card>
              <CardContent className="p-6">
                <p className="text-text-secondary leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications">
            <Card>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {(product.specifications || []).map((spec: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted">{spec.label || spec.name}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                  {(!product.specifications || product.specifications.length === 0) && (
                    <div className="text-text-muted">No specifications available.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-4 text-text-muted">No reviews yet.</div>
              ) : reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.user?.name || review.reviewer_name || 'Anonymous User'}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-warning text-warning' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-text-muted">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-text-secondary">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden bg-surface-elevated flex items-center justify-center">
                      {p.images?.[0]?.image_url ? (
                        <img
                          src={p.images[0].image_url}
                          alt={p.product_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package className="h-10 w-10 text-text-muted" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{p.product_name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary">E£{p.wholesale_price || p.price}</span>
                        {p.wholesale_price && <span className="text-sm text-text-muted line-through">E£{p.price}</span>}
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        Min. order: {p.minimum_order_quantity || 1} {p.unit_of_measure || 'unit'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
