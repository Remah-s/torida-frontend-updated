import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,

  MessageCircle,
  Package,
  TrendingUp,
  Users,
  Building2,
  Globe,
} from 'lucide-react';
import { Card, CardContent, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { formatCurrency } from '@/utils';
import api from '@/services/api';
import { userService } from '@/services/user';
import { productService } from '@/services/product';

const SupplierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [supplierData, setSupplierData] = React.useState<any>(null);
  const [supplierProducts, setSupplierProducts] = React.useState<any[]>([]);
  const [supplierReviews, setSupplierReviews] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    Promise.all([
      userService.getUser(Number(id)).catch(() => null),
      productService.getProducts({ company_id: Number(id), per_page: 20 }).catch(() => ({ items: [] })),
      api.get('/reviews', { params: { target_id: id, target_type: 'user' } }).catch(() => ({ data: { items: [] } })),
    ]).then(([user, prodRes, revRes]: [any, any, any]) => {
      const productData: any = prodRes || {};
      const reviewData: any = revRes?.data || {};
      const products: any[] = productData.items || [];
      const reviews: any[] = reviewData.items || [];
      const currentUser: any = user || {};

      setSupplierData({
        ...currentUser,
        name: currentUser.business_profile?.company_name || currentUser.full_name || 'Unknown Supplier',
        description: currentUser.business_profile?.description || '',
        image: currentUser.business_profile?.logo_url || '',
        cover: currentUser.business_profile?.cover_image || '',
        location: currentUser.location || 'Not specified',
        rating: currentUser.business_profile?.average_rating || 0,
        reviews: currentUser.business_profile?.review_count || 0,
        verified: currentUser.business_profile?.verification_status === 'verified',
        member_since: currentUser.created_at ? new Date(currentUser.created_at).getFullYear().toString() : 'N/A',
        response_time: 'N/A',
        phone: currentUser.business_profile?.business_phone || currentUser.phone || 'N/A',
        email: currentUser.business_profile?.business_email || currentUser.email || 'N/A',
        website: currentUser.business_profile?.website || 'N/A',
        categories: [],
        stats: {
          products: productData.pagination?.total_items || products.length,
          orders: 0,
          rating: currentUser.business_profile?.average_rating || 0,
          responseTime: 'N/A',
        }
      });
      setSupplierProducts(products);
      setSupplierReviews(reviews);
    }).finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading || !supplierData) {
    return <div className="p-20 text-center">Loading supplier details...</div>;
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="h-48 md:h-64 relative overflow-hidden">
        <img
          src={supplierData.cover}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Supplier Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <img
              src={supplierData.image}
              alt={supplierData.name}
              className="h-24 w-24 rounded-xl border-4 border-surface object-cover shadow-lg"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-text-primary">{supplierData.name}</h1>
                {supplierData.verified && (
                  <Badge variant="success" className="gap-1">
                    <Check className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{supplierData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-medium text-text-primary">{supplierData.rating}</span>
                  <span>({supplierData.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Member since {supplierData.member_since}</span>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {supplierData.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {supplierData.categories.map((cat: string) => (
                  <Badge key={cat} variant="outline">{cat}</Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <Button leftIcon={<MessageCircle className="h-4 w-4" />}>
                Contact Supplier
              </Button>
              <Button variant="outline" leftIcon={<Phone className="h-4 w-4" />}>
                Call Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Package className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{supplierData.stats.products}</p>
            <p className="text-sm text-text-muted">Products</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{supplierData.stats.orders.toLocaleString()}</p>
            <p className="text-sm text-text-muted">Orders</p>
          </Card>
          <Card className="p-4 text-center">
            <Star className="h-6 w-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{supplierData.stats.rating}</p>
            <p className="text-sm text-text-muted">Rating</p>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="h-6 w-6 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{supplierData.stats.responseTime}</p>
            <p className="text-sm text-text-muted">Response Time</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 mb-6">
            <TabsTrigger value="products" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
              Products ({supplierProducts.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
              About
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
              Reviews ({supplierData.reviews})
            </TabsTrigger>
            <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplierProducts.map(product => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-square relative overflow-hidden bg-surface-elevated">
                      {product.images?.[0]?.image_url && (
                        <img
                          src={product.images[0].image_url}
                          alt={product.product_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <Badge className="absolute top-3 left-3" variant="success">
                        Wholesale
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-text-primary mb-2 line-clamp-1">{product.product_name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-xs text-text-muted">{product.average_rating || 0}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
                        <span className="text-sm text-text-muted">/unit</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">Stock: {product.stock_quantity}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">About {supplierData.name}</h2>
              <p className="text-text-secondary leading-relaxed mb-6">{supplierData.description}</p>

              <h3 className="font-semibold text-text-primary mb-3">Business Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Member Since</p>
                    <p className="font-medium text-text-primary">{supplierData.member_since}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Location</p>
                    <p className="font-medium text-text-primary">{supplierData.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Response Time</p>
                    <p className="font-medium text-text-primary">{supplierData.response_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Total Orders</p>
                    <p className="font-medium text-text-primary">{supplierData.stats.orders.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-text-primary mb-1">{supplierData.rating}</p>
                  <div className="flex justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(supplierData.rating) ? 'fill-warning text-warning' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted">{supplierData.reviews} reviews</p>
                </div>
              </Card>

              <div className="lg:col-span-2 space-y-4">
                {supplierReviews.map(review => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-text-primary">{review.user}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-warning text-warning' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-text-muted">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm">{review.comment}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Phone</p>
                    <p className="font-medium text-text-primary">{supplierData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Email</p>
                    <p className="font-medium text-text-primary">{supplierData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Website</p>
                    <p className="font-medium text-primary">{supplierData.website}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Address</p>
                    <p className="font-medium text-text-primary">{supplierData.location}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierDetailPage;
