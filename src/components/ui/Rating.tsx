import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (rating: number) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (interactive) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverValue(null);
    }
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= max; i++) {
      const filled = i <= Math.floor(displayValue);
      const halfFilled = !filled && i === Math.ceil(displayValue) && displayValue % 1 !== 0;

      stars.push(
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'relative transition-transform',
            interactive && 'cursor-pointer hover:scale-110',
            !interactive && 'cursor-default'
          )}
        >
          {filled ? (
            <Star className={cn(sizeClasses[size], 'fill-warning text-warning')} />
          ) : halfFilled ? (
            <div className="relative">
              <Star className={cn(sizeClasses[size], 'text-border')} />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <StarHalf className={cn(sizeClasses[size], 'fill-warning text-warning')} />
              </div>
            </div>
          ) : (
            <Star className={cn(sizeClasses[size], 'text-border')} />
          )}
        </button>
      );
    }

    return stars;
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">{renderStars()}</div>
      {showValue && (
        <span className={cn(
          'font-medium text-text-primary',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn(
          'text-text-muted',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
};

export { Rating };
export type { RatingProps };
