import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Grid, List, ChevronDown, X, Star, ShoppingCart, Loader2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button, Card, CardContent, Badge, Skeleton } from '@/components/ui';
import { productService, categoryService } from '@/services';
import { ApiError } from '@/services/api';
import { cn, formatCurrency, debounce } from '@/utils';
import type { Product, Category, Pagination } from '@/types';
import toast from 'react-hot-toast';

const sortOptions = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'product_name:asc', label: 'Name: A-Z' },
];

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'created_at:desc',
    page: Number(searchParams.get('page')) || 1,
  });

  // Fetch categories on mount
  useEffect(() => {
    categoryService.getCategories(true).then(setCategories).catch(() => {});
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters.category_id, filters.min_price, filters.max_price, filters.sort, filters.page]); // eslint-disable-line

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(() => fetchProducts(), 400),
    [filters.category_id, filters.min_price, filters.max_price, filters.sort]
  );

  useEffect(() => {
    debouncedSearch();
  }, [filters.search]); // eslint-disable-line

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const [sortBy, sortOrder] = filters.sort.split(':');
      const result = await productService.getProducts({
        page: filters.page,
        per_page: 12,
        search: filters.search || undefined,
        category_id: filters.category_id ? Number(filters.category_id) : undefined,
        min_price: filters.min_price ? Number(filters.min_price) : undefined,
        max_price: filters.max_price ? Number(filters.max_price) : undefined,
        sort_by: sortBy,
        sort_order: sortOrder as 'asc' | 'desc',
      });
      setProducts(result.items || []);
      setPagination(result.pagination || null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load products';
      toast.error(msg);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, ...(key !== 'page' ? { page: 1 } : {}) }));
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({ search: '', category_id: '', min_price: '', max_price: '', sort: 'created_at:desc', page: 1 });
    setSearchParams({});
  };

  const goToPage = (page: number) => handleFilterChange('page', String(page));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Products</h1>
              <p className="text-sm text-text-muted">
                {isLoading ? 'Loading...' : `${pagination?.total_items ?? products.length} products found`}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-surface-elevated text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="h-10 pl-4 pr-10 rounded-xl border border-border bg-surface text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              </div>
              {/* View Mode */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-elevated')}>
                  <Grid className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-elevated')}>
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={cn('w-64 shrink-0', 'fixed md:static inset-0 z-50 bg-surface md:bg-transparent transform transition-transform md:transform-none', showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0')}>
            <div className="h-full overflow-y-auto p-4 md:p-0">
              <div className="flex items-center justify-between md:hidden mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></Button>
              </div>
              <Card className="p-4 space-y-6">
                {/* Categories from API */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="category" checked={!filters.category_id} onChange={() => handleFilterChange('category_id', '')} className="text-primary focus:ring-primary" />
                      <span className={cn(!filters.category_id ? 'text-primary font-medium' : 'text-text-secondary')}>All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="category" checked={filters.category_id === String(cat.id)} onChange={() => handleFilterChange('category_id', String(cat.id))} className="text-primary focus:ring-primary" />
                        <span className={cn(filters.category_id === String(cat.id) ? 'text-primary font-medium' : 'text-text-secondary')}>
                          {cat.category_name} {cat.product_count !== undefined && <span className="text-text-muted">({cat.product_count})</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={filters.min_price} onChange={(e) => handleFilterChange('min_price', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <span className="text-text-muted">-</span>
                    <input type="number" placeholder="Max" value={filters.max_price} onChange={(e) => handleFilterChange('max_price', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <Button variant="ghost" onClick={clearFilters} className="w-full">Clear All Filters</Button>
              </Card>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
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
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-text-muted mb-4">No products found</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
                  {products.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className={cn('relative overflow-hidden bg-gray-100', viewMode === 'grid' ? 'aspect-square' : 'aspect-video')}>
                          {product.images?.[0] ? (
                            <img src={product.images[0].image_url} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <ShoppingCart className="h-12 w-12 opacity-20" />
                            </div>
                          )}
                          {product.is_active && (
                            <Badge className="absolute top-3 left-3" variant="success">Available</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <p className="text-xs text-text-muted mb-1">{product.category?.category_name || 'Uncategorized'}</p>
                          <h3 className="font-semibold text-text-primary mb-2 line-clamp-1">{product.product_name}</h3>
                          {product.average_rating !== undefined && (
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="h-3 w-3 fill-warning text-warning" />
                              <span className="text-xs text-text-muted">{product.average_rating} ({product.review_count ?? 0})</span>
                            </div>
                          )}
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                          </div>
                          <p className="text-xs text-text-muted">Stock: {product.stock_quantity} units</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(filters.page - 1)}
                      disabled={!pagination.has_prev}
                      className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-surface-elevated transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                      const start = Math.max(1, filters.page - 2);
                      const page = start + i;
                      if (page > pagination.total_pages) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={cn('h-9 w-9 rounded-lg text-sm font-medium transition-colors', page === filters.page ? 'bg-primary text-white' : 'border border-border hover:bg-surface-elevated')}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => goToPage(filters.page + 1)}
                      disabled={!pagination.has_next}
                      className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-surface-elevated transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
