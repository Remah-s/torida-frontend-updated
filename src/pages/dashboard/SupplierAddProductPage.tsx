import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  DollarSign,
  Package,
  Tag,
} from 'lucide-react';
import { Button, Card, CardContent, Input, SimpleSelect } from '@/components/ui';
import { productService } from '@/services/product';
import { categoryService } from '@/services/category';

const units = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'L', label: 'Liters (L)' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'cartons', label: 'Cartons' },
  { value: 'bags', label: 'Bags' },
];

const SupplierAddProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [pricingTiers, setPricingTiers] = useState([
    { minQty: 10, maxQty: 49, price: 0 },
    { minQty: 50, maxQty: 99, price: 0 },
    { minQty: 100, maxQty: null, price: 0 },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    retailPrice: '',
    wholesalePrice: '',
    minOrder: '',
    stock: '',
    unit: 'kg',
  });

  React.useEffect(() => {
    if (isEditMode && id) {
      productService.getProduct(id).then((prod) => {
        const product = prod as any;
        setFormData({
          name: product.product_name || '',
          sku: product.sku || '',
          category: String(product.category_id || ''),
          description: product.description || '',
          retailPrice: String(product.price || ''),
          wholesalePrice: String(product.price || ''),
          minOrder: '1',
          stock: String(product.stock_quantity || ''),
          unit: 'kg',
        });
        const prodImages = Array.isArray((prod as any)?.images) ? (prod as any).images : [];
        if (prodImages.length > 0) {
          setImages(prodImages.map((img: any) => img.image_url || ''));
        }
      }).catch(console.error);
    }
  }, [id, isEditMode]);

  React.useEffect(() => {
    categoryService.getCategories().then((res) => {
      const cats = Array.isArray(res) ? res : [];
      setCategories(
        cats.map((c: any) => ({ value: String(c.id || ''), label: c.category_name || 'Unnamed' })).filter(c => c.value !== '')
      );
    }).catch(console.error);
  }, []);

  const handleAddImage = () => {
    if (images.length < 5) {
      // In real app, this would open a file picker
      setImages([...images, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400']);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
      const payload = {
        product_name: formData.name,
        category_id: parseInt(formData.category) || undefined,
        price: parseFloat(formData.retailPrice),
        description: formData.description,
        stock_quantity: parseInt(formData.stock) || 0,
        sku: formData.sku,
        is_active: true
      };
      
      const request = isEditMode && id
        ? productService.updateProduct(id, payload)
        : productService.createProduct(payload as any);
        
      request
        .then(() => navigate('/dashboard/supplier/products'))
        .catch(console.error)
        .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard/supplier/products" className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-text-muted">{isEditMode ? 'Update your product details' : 'Fill in the details to add a new product to your catalog'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <Input
                        placeholder="e.g., Organic Rice Premium"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">SKU *</label>
                        <Input
                          placeholder="e.g., RICE-001"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <SimpleSelect
                          value={formData.category || undefined}
                          onChange={(value: string) => setFormData({ ...formData, category: value })}
                          options={categories}
                          placeholder="Select category"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                        placeholder="Describe your product..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Product Images</h2>
                  <p className="text-sm text-text-muted mb-4">Upload up to 5 images. First image will be the primary image.</p>
                  <div className="flex flex-wrap gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center py-1">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                    {images.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"
                      >
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-xs">Upload Image</span>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Retail Price (EGP) *</label>
                        <Input
                          type="number"
                          placeholder="e.g., 450"
                          value={formData.retailPrice}
                          onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                          leftIcon={<DollarSign className="h-4 w-4" />}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Wholesale Price (EGP) *</label>
                        <Input
                          type="number"
                          placeholder="e.g., 380"
                          value={formData.wholesalePrice}
                          onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                          leftIcon={<DollarSign className="h-4 w-4" />}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tiered Pricing (Optional)</label>
                      <p className="text-xs text-text-muted mb-3">Set different prices for different order quantities</p>
                      {pricingTiers.map((tier, index) => (
                        <div key={index} className="flex items-center gap-4 mb-2">
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={tier.minQty}
                              onChange={(e) => {
                                const newTiers = [...pricingTiers];
                                newTiers[index].minQty = parseInt(e.target.value) || 0;
                                setPricingTiers(newTiers);
                              }}
                              className="w-24"
                            />
                            <span className="text-text-muted">to</span>
                            <Input
                              type="number"
                              placeholder="Max"
                              value={tier.maxQty || ''}
                              onChange={(e) => {
                                const newTiers = [...pricingTiers];
                                newTiers[index].maxQty = parseInt(e.target.value) || null;
                                setPricingTiers(newTiers);
                              }}
                              className="w-24"
                            />
                            <span className="text-text-muted">units</span>
                          </div>
                          <Input
                            type="number"
                            placeholder="Price"
                            value={tier.price || ''}
                            onChange={(e) => {
                              const newTiers = [...pricingTiers];
                              newTiers[index].price = parseInt(e.target.value) || 0;
                              setPricingTiers(newTiers);
                            }}
                            leftIcon={<DollarSign className="h-4 w-4" />}
                            className="w-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Inventory */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Inventory</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                      <Input
                        type="number"
                        placeholder="e.g., 500"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        leftIcon={<Package className="h-4 w-4" />}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Order Quantity *</label>
                      <Input
                        type="number"
                        placeholder="e.g., 10"
                        value={formData.minOrder}
                        onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Unit *</label>
                      <SimpleSelect
                        value={formData.unit}
                        onChange={(value: string) => setFormData({ ...formData, unit: value })}
                        options={units}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    {isEditMode ? 'Save Changes' : 'Add Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/dashboard/supplier/products')}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierAddProductPage;
