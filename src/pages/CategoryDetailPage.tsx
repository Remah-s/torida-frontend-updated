import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Grid,
  List,
  Star,
  ShoppingCart,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, Badge, Skeleton, Button } from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency, cn } from '@/utils';
import { categoryService } from '@/services/category';
import { productService } from '@/services/product';
import { useApi } from '@/hooks/useApi';
import type { Category, Product, PaginatedData } from '@/types';

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
];

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: category,
    loading: categoryLoading,
    error: categoryError,
    execute: fetchCategory,
  } = useApi<Category>((...args: unknown[]) => categoryService.getCategory(args[0] as string));

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    execute: fetchProducts,
  } = useApi<PaginatedData<Product>>((filters: any) => productService.getProducts(filters));

  const isLoading = categoryLoading || productsLoading;

  useEffect(() => {
    if (slug) {
      fetchCategory(slug);
    }
  }, [slug, fetchCategory]);

  useEffect(() => {
    if (category) {
      const filters: any = { category_id: category.id };
      
      // Add sorting
      switch (sortBy) {
        case 'price_asc':
          filters.sort_by = 'price';
          filters.sort_order = 'asc';
          break;
        case 'price_desc':
          filters.sort_by = 'price';
          filters.sort_order = 'desc';
          break;
        case 'rating':
          filters.sort_by = 'rating';
          filters.sort_order = 'desc';
          break;
        case 'newest':
          filters.sort_by = 'created_at';
          filters.sort_order = 'desc';
          break;
        default:
          // popularity or default
          break;
      }
      
      fetchProducts(filters);
    }
  }, [category, sortBy, fetchProducts]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.items || []);
    }
  }, [productsData]);

  const handleAddToCart = async (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      await addToCart(product, product.minimum_order_quantity || 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Header */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="text-text-muted hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 text-text-muted" />
            <Link to="/categories" className="text-text-muted hover:text-primary">Categories</Link>
            <ChevronRight className="h-4 w-4 text-text-muted" />
            <span className="text-text-primary font-medium">{category?.category_name || 'Category'}</span>
          </nav>

          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary">{category?.category_name || 'Category'}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>{products.length} products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="h-4 w-4" />}
            className="lg:hidden"
          >
            Filters
          </Button>

          <div className="flex items-center gap-3 ml-auto">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 pl-4 pr-10 rounded-xl border border-border bg-surface text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="hidden md:flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-elevated'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-elevated'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="p-4 space-y-6 sticky top-24">
              <div>
                <h3 className="font-semibold text-text-primary mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-text-muted">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-3 w-3',
                              i < rating ? 'fill-warning text-warning' : 'text-gray-300'
                            )}
                          />
                        ))}
                        <span className="text-sm text-text-muted ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-3">Min. Order</h3>
                <div className="space-y-2">
                  {['1-10', '11-50', '51-100', '100+'].map(range => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                      <span className="text-text-secondary">{range} units</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="ghost" className="w-full">Clear All</Button>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={cn(
                'grid gap-4',
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={cn(
                'grid gap-4',
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              )}>
                {products.map(product => (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className={cn(
                        'relative overflow-hidden',
                        viewMode === 'grid' ? 'aspect-square' : 'aspect-video'
                      )}>
                        <img
                          src={product.images?.[0]?.image_url || 'https://via.placeholder.com/400'}
                          alt={product.product_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                          }}
                        />
                        <Badge className="absolute top-3 left-3" variant="success">
                          Wholesale
                        </Badge>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product.id);
                          }}
                          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-surface shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-text-muted mb-1">{product.seller?.business_profile?.business_name || 'Unknown Supplier'}</p>
                        <h3 className="font-semibold text-text-primary mb-2 line-clamp-1">
                          {product.product_name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span className="text-xs text-text-muted">
                            {product.average_rating?.toFixed(1) || '0.0'} ({product.review_count || 0})
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">
                          Min. order: {product.minimum_order_quantity || 1} {product.unit || 'units'}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
