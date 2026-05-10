import * as React from 'react';
import { cn } from '@/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive' | 'glass';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'rounded-2xl border border-border bg-surface shadow-sm',
      hover: 'rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20',
      interactive: 'rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 cursor-pointer group',
      glass: 'rounded-2xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-tight tracking-tight text-text-primary transition-colors duration-200 group-hover:text-primary',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Product Card with built-in animations
interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  category?: string;
  rating?: number;
  reviewCount?: number;
  supplier?: string;
  badge?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ 
    className, 
    image, 
    name, 
    price, 
    originalPrice, 
    category, 
    rating, 
    reviewCount, 
    supplier, 
    badge,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group rounded-2xl border border-border bg-surface overflow-hidden',
          'transition-all duration-500 ease-out',
          'hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30',
          'cursor-pointer',
          className
        )}
        {...props}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 text-xs font-semibold bg-success text-white rounded-full shadow-md animate-scaleIn">
                {badge}
              </span>
            </div>
          )}
          
          {/* Quick Action Buttons */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button className="flex-1 py-2 px-4 bg-white/95 backdrop-blur-sm text-text-primary text-sm font-medium rounded-lg shadow-md hover:bg-primary hover:text-white transition-colors duration-200">
              Quick View
            </button>
            <button className="p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:bg-primary hover:text-white transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {category && (
            <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">{category}</p>
          )}
          <h3 className="font-semibold text-text-primary mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>
          
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5 transition-colors duration-200',
                    i < Math.floor(rating) ? 'text-warning fill-warning' : 'text-gray-300'
                  )}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {reviewCount && (
                <span className="text-xs text-text-muted ml-1">({reviewCount})</span>
              )}
            </div>
          )}
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">E£{price}</span>
            {originalPrice && (
              <span className="text-sm text-text-muted line-through">E£{originalPrice}</span>
            )}
          </div>
          
          {supplier && (
            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {supplier}
            </p>
          )}
        </div>
      </div>
    );
  }
);
ProductCard.displayName = 'ProductCard';

// Category Card with animations
interface CategoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  name: string;
  count?: number;
}

const CategoryCard = React.forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ className, image, name, count, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative rounded-2xl overflow-hidden cursor-pointer',
          'transition-all duration-500 ease-out',
          'hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2',
          className
        )}
        {...props}
      >
        <div className="aspect-square relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-125"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-200">
              {name}
            </h3>
            {count && (
              <p className="text-sm text-gray-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>{count}</span> products
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </p>
            )}
          </div>
          
          {/* Animated Border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors duration-300" />
        </div>
      </div>
    );
  }
);
CategoryCard.displayName = 'CategoryCard';

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  ProductCard,
  CategoryCard 
};
