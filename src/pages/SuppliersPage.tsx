import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Check,
  ChevronRight,
  Package,

  Building2,
} from 'lucide-react';
import { Card, Badge, Skeleton, Button } from '@/components/ui';
import { userService } from '@/services/user';

/**
 * Safely extracts an array of items from any API response shape:
 *   - raw array:          [...]
 *   - result.items:       { items: [...] }
 *   - result.data:        { data: [...] }
 *   - result.data.items:  { data: { items: [...] } }
 *   - anything else:      []
 */
function extractItems(result: any): any[] {
  if (Array.isArray(result)) {
    console.log('[extractItems] Shape: raw array, length:', result.length);
    return result;
  }
  if (result && Array.isArray(result.items)) {
    console.log('[extractItems] Shape: result.items, length:', result.items.length);
    return result.items;
  }
  if (result && Array.isArray(result.data)) {
    console.log('[extractItems] Shape: result.data (array), length:', result.data.length);
    return result.data;
  }
  if (result && result.data && Array.isArray(result.data.items)) {
    console.log('[extractItems] Shape: result.data.items, length:', result.data.items.length);
    return result.data.items;
  }
  console.warn('[extractItems] Unrecognised response shape — returning []. Raw result:', result);
  return [];
}

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Fetch all users then filter on the frontend —
        // avoids relying on getSuppliers() which may return unexpected/empty results.
        const result = await userService.getUsers({ per_page: 100 });

        // Debug: log raw API response before any parsing
        console.log('[SuppliersPage] Raw API response from getUsers():', result);

        const allUsers = extractItems(result);
        console.log('[SuppliersPage] Parsed users count:', allUsers.length);

        // Keep only type_id 1 (Supplier) or type_id 3 (Company).
        // Explicitly exclude type_id 2 (Retailer) and all other types.
        const sellerUsers = allUsers.filter((u: any) => {
          if (u.type_id === 2) {
            // Retailer — always exclude
            console.log(
              `[SuppliersPage] Excluding retailer ${u.id} (${u.full_name}): type_id=${u.type_id}`
            );
            return false;
          }
          const isSeller = u.type_id === 1 || u.type_id === 3;
          if (!isSeller) {
            console.log(
              `[SuppliersPage] Excluding user ${u.id} (${u.full_name}): type_id=${u.type_id}`
            );
          }
          return isSeller;
        });

        console.log(
          `[SuppliersPage] Filtered sellers: ${allUsers.length} total → ${sellerUsers.length} suppliers/companies`
        );

        setSuppliers(sellerUsers);
      } catch (err) {
        console.error('[SuppliersPage] Failed to load suppliers:', err);
        setError('Failed to load suppliers. Please try again later.');
        setSuppliers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Defensive: ensure suppliers is always an array before filtering
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

  const filteredSuppliers = safeSuppliers.filter(s => {
    // Apply search query filter
    const matchesSearch =
      !searchQuery ||
      (s.full_name || s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.business_profile?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Apply location dropdown filter
    const supplierLocation = (s.location || '').split(',')[0].trim();
    const matchesLocation = !filterLocation || supplierLocation === filterLocation;

    return matchesSearch && matchesLocation;
  });

  // Debug: log filtering results whenever filters change
  if (searchQuery || filterLocation) {
    console.log(
      `[SuppliersPage] Filter: search="${searchQuery}", location="${filterLocation}" → ${filteredSuppliers.length}/${safeSuppliers.length} shown`
    );
  }

  const locations = [
    ...new Set(safeSuppliers.map(s => (s.location || '').split(',')[0].trim())),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-dark to-teal py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Trusted Suppliers
          </h1>
          <p className="text-gray-300 mb-6 max-w-2xl">
            Connect with verified suppliers across Egypt. All suppliers are vetted for quality and reliability.
          </p>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="search"
                placeholder="Search suppliers by name, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="h-12 px-4 rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-light text-error text-sm border border-error/20">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">150+</p>
            <p className="text-sm text-text-muted">Verified Suppliers</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">15,000+</p>
            <p className="text-sm text-text-muted">Products Available</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">50,000+</p>
            <p className="text-sm text-text-muted">Orders Fulfilled</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">98%</p>
            <p className="text-sm text-text-muted">Satisfaction Rate</p>
          </Card>
        </div>

        {/* Suppliers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-32" />
                <div className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full mt-4" />
                </div>
              </Card>
            ))
            : filteredSuppliers.map(supplier => (
              <Link key={supplier.id} to={`/suppliers/${supplier.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Cover */}
                  <div className="h-24 relative overflow-hidden bg-surface-elevated">
                    {supplier.business_profile?.cover_image && (
                      <img
                        src={supplier.business_profile.cover_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="p-4">
                    {/* Logo & Name */}
                    <div className="flex gap-4 -mt-10 relative">
                      <div className="h-16 w-16 rounded-xl border-4 border-surface bg-surface-elevated overflow-hidden shrink-0">
                        {supplier.business_profile?.logo_url ? (
                          <img
                            src={supplier.business_profile.logo_url}
                            alt={supplier.full_name || supplier.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-full h-full p-2 text-text-muted" />
                        )}
                      </div>
                      <div className="flex-1 pt-10">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                            {supplier.business_profile?.company_name || supplier.full_name || supplier.name}
                          </h3>
                          {supplier.business_profile?.verification_status === 'verified' && (
                            <Check className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{supplier.location || 'Location not specified'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 py-3 border-y border-border">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium text-text-primary">{supplier.rating || 'N/A'}</span>
                        <span className="text-xs text-text-muted">({supplier.reviews || 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-text-muted">
                        <Package className="h-4 w-4" />
                        <span className="text-sm">{supplier.products_count || 0} products</span>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(supplier.categories || []).slice(0, 3).map((cat: string) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>

                    {/* Response Time */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <span className="text-xs text-text-muted">Response time: {supplier.response_time || 'N/A'}</span>
                      <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
        </div>

        {/* No Results */}
        {filteredSuppliers.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No suppliers found</h3>
            <p className="text-text-muted mb-6">Try adjusting your search criteria</p>
            <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;