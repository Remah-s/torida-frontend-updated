import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Input, SimpleSelect } from '@/components/ui';
import { productService } from '@/services/product';

const SupplierProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = () => {
    setIsLoading(true);
    productService.getProducts({ per_page: 100 }).then((response) => {
      setProducts(response.items || []);
    }).catch(console.error).finally(() => setIsLoading(false));
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      productService.deleteProduct(id).then(() => {
        fetchProducts();
      }).catch(console.error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.product_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.is_active) || 
      (statusFilter === 'out_of_stock' && product.stock_quantity === 0);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'low_stock': return <Badge variant="warning">Low Stock</Badge>;
      case 'out_of_stock': return <Badge variant="error">Out of Stock</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-text-muted">Manage your product catalog</p>
          </div>
          <Link to="/dashboard/supplier/products/add">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <SimpleSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'low_stock', label: 'Low Stock' },
              { value: 'out_of_stock', label: 'Out of Stock' },
            ]}
            className="w-40"
          />
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="p-8 text-center col-span-full">Loading products...</div>
          ) : filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="h-40 bg-surface-elevated relative">
                {product.images?.[0]?.image_url ? (
                  <img
                    src={product.images[0].image_url}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-text-muted opacity-30" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(product.stock_quantity === 0 ? 'out_of_stock' : (product.is_active ? 'active' : 'inactive'))}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{product.product_name}</h3>
                    <p className="text-xs text-text-muted">{product.sku || 'No SKU'}</p>
                  </div>
                  <button className="p-1 hover:bg-surface-elevated rounded">
                    <MoreVertical className="h-4 w-4 text-text-muted" />
                  </button>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-primary">E£{product.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                  <span>Stock: {product.stock_quantity} units</span>
                  <span>Cat: {product.category_id || 'N/A'}</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/dashboard/supplier/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full" leftIcon={<Edit className="h-3 w-3" />}>
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-500 border-red-200 hover:bg-red-50" 
                    onClick={() => handleDelete(product.id)}
                    leftIcon={<Trash2 className="h-3 w-3" />}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-text-muted mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'Start adding products to your catalog'}
            </p>
            <Link to="/dashboard/supplier/products/add">
              <Button>Add Your First Product</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupplierProductsPage;
