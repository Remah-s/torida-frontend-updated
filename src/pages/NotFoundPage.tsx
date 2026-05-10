import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <span className="text-[150px] md:text-[200px] font-bold text-surface-elevated">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 md:h-24 md:w-24 text-primary opacity-50" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button size="lg" leftIcon={<Home className="h-5 w-5" />}>
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Go Back
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-text-muted mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="text-primary hover:underline text-sm">
              Browse Products
            </Link>
            <Link to="/categories" className="text-primary hover:underline text-sm">
              Categories
            </Link>
            <Link to="/suppliers" className="text-primary hover:underline text-sm">
              Suppliers
            </Link>
            <Link to="/help" className="text-primary hover:underline text-sm">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
