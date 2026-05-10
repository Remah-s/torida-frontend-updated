import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5',
        secondary: 'bg-dark text-white hover:bg-dark-light shadow-md hover:shadow-lg hover:shadow-dark/25 hover:-translate-y-0.5',
        outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20',
        ghost: 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive: 'bg-error text-white hover:bg-red-600 shadow-md hover:shadow-lg hover:shadow-error/25 hover:-translate-y-0.5',
        success: 'bg-success text-white hover:bg-green-600 shadow-md hover:shadow-lg hover:shadow-success/25 hover:-translate-y-0.5',
        gradient: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 bg-[length:200%_200%] hover:bg-right',
        teal: 'bg-teal text-white hover:bg-teal-light shadow-md hover:shadow-lg hover:shadow-teal/25 hover:-translate-y-0.5',
        warning: 'bg-warning text-white hover:bg-yellow-600 shadow-md hover:shadow-lg hover:shadow-warning/25 hover:-translate-y-0.5',
        danger: 'bg-error text-white hover:bg-red-600 shadow-md hover:shadow-lg hover:shadow-error/25 hover:-translate-y-0.5',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Ripple effect overlay */}
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
        </span>
        
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="transition-transform duration-200 group-hover:scale-110">{leftIcon}</span>
        )}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon && (
          <span className="transition-transform duration-200 group-hover:translate-x-1">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
