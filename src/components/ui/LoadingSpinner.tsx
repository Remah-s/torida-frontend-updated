import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'orbit';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const containerSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-full bg-primary',
              size === 'sm' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-3 w-3' : size === 'xl' ? 'h-4 w-4' : 'h-2 w-2'
            )}
            style={{
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('relative', containerSizes[size], className)}>
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <div className="absolute inset-1 rounded-full bg-primary animate-pulse" />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex items-end gap-1', containerSizes[size], className)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 bg-primary rounded-full"
            style={{
              animation: 'bars 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
              height: '60%',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'orbit') {
    return (
      <div className={cn('relative', containerSizes[size], className)}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-primary-light animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
    );
  }

  return (
    <Loader2
      className={cn('animate-spin text-primary', sizeClasses[size], className)}
    />
  );
};

// Full Page Loading
interface PageLoaderProps {
  message?: string;
  variant?: LoadingSpinnerProps['variant'];
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...',
  variant = 'orbit'
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="xl" variant={variant} />
      <p className="text-text-secondary animate-pulse">{message}</p>
    </div>
  );
};

// Overlay Loading
interface OverlayLoaderProps {
  isLoading: boolean;
  message?: string;
}

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ 
  isLoading, 
  message = 'Loading...' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-2xl">
        <LoadingSpinner size="xl" variant="orbit" />
        <p className="text-text-secondary font-medium">{message}</p>
      </div>
    </div>
  );
};

// Skeleton Loader
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  return (
    <div
      className={cn(
        'bg-surface-elevated relative overflow-hidden',
        variantClasses[variant],
        animate && 'shimmer',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

// Skeleton Card
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface overflow-hidden', className)}>
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-2/3 h-3" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
    </div>
  );
};

// Skeleton Table Row
const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 5,
  className,
}) => {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

// Skeleton Product Grid
const SkeletonProductGrid: React.FC<{ count?: number; className?: string }> = ({
  count = 8,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// Progress Bar
interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'gradient' | 'striped';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  showLabel = false,
  variant = 'default',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-primary',
    gradient: 'bg-gradient-to-r from-primary via-primary-light to-primary bg-[length:200%_100%] animate-gradientFlow',
    striped: 'bg-primary bg-[length:1rem_1rem] bg-repeat',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-surface-elevated rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-text-muted mt-1 text-right">{progress}%</p>
      )}
    </div>
  );
};

// Add keyframes for bars animation
const style = document.createElement('style');
style.textContent = `
  @keyframes bars {
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }
`;
document.head.appendChild(style);

export { 
  LoadingSpinner, 
  PageLoader, 
  OverlayLoader,
  Skeleton, 
  SkeletonCard, 
  SkeletonTableRow,
  SkeletonProductGrid,
  ProgressBar 
};
export type { LoadingSpinnerProps, SkeletonProps, ProgressBarProps };
