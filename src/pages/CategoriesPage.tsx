import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '@/components/ui';
import { Package, ArrowRight, Loader2 } from 'lucide-react';
import { categoryService } from '@/services';
import type { Category } from '@/types';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories(true);
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Placeholder images for categories without images
  const getCategoryImage = (category: Category, index: number): string => {
    const placeholderImages = [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
      'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
      'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
    ];
    return placeholderImages[index % placeholderImages.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark to-teal py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Browse Categories
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our wide range of product categories from verified suppliers across Egypt
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No categories available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.id} to={`/categories/${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={getCategoryImage(category, index)}
                      alt={category.category_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-primary text-white">
                      {category.product_count || 0} products
                    </Badge>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg">{category.category_name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Browse Products
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-surface-elevated py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="h-12 w-12 rounded-full bg-primary-light mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-text-primary">{categories.length}</div>
              <div className="text-sm text-text-muted">Categories</div>
            </div>
            <div>
              <div className="h-12 w-12 rounded-full bg-primary-light mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {categories.reduce((sum, c) => sum + (c.product_count || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-text-muted">Products</div>
            </div>
            <div>
              <div className="h-12 w-12 rounded-full bg-primary-light mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-text-primary">500+</div>
              <div className="text-sm text-text-muted">Suppliers</div>
            </div>
            <div>
              <div className="h-12 w-12 rounded-full bg-primary-light mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-text-primary">27</div>
              <div className="text-sm text-text-muted">Governorates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
