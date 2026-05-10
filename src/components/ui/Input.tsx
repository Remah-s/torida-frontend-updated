import * as React from 'react';
import { cn } from '@/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'floating' | 'filled';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, leftIcon, rightIcon, variant = 'default', id, ...props }, ref) => {
    const inputId = id || React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(Boolean(props.value || props.defaultValue));
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      props.onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    if (variant === 'floating') {
      return (
        <div className="w-full">
          <div className="relative">
            {leftIcon && (
              <div className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10",
                isFocused ? "text-primary" : "text-text-muted"
              )}>
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              id={inputId}
              className={cn(
                'flex w-full rounded-xl border bg-surface px-4 py-4 pt-6 text-sm text-text-primary',
                'transition-all duration-300 ease-out',
                'placeholder:transparent',
                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-elevated',
                'peer',
                error
                  ? 'border-error focus:ring-error/30 focus:border-error'
                  : isFocused ? 'border-primary shadow-md shadow-primary/10' : 'border-border hover:border-border-dark',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                className
              )}
              ref={ref}
              placeholder={label}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'absolute left-4 transition-all duration-300 ease-out pointer-events-none',
                  'text-text-muted',
                  leftIcon && 'left-10',
                  (isFocused || hasValue)
                    ? 'top-2 text-xs text-primary'
                    : 'top-1/2 -translate-y-1/2 text-sm',
                  error && 'text-error'
                )}
              >
                {label}
              </label>
            )}
            {rightIcon && (
              <div className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                isFocused ? "text-primary" : "text-text-muted"
              )}>
                {rightIcon}
              </div>
            )}
            
            {/* Animated underline */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-transform duration-300 rounded-b-xl",
              isFocused ? "scale-x-100" : "scale-x-0"
            )} />
          </div>
          
          {/* Error/Helper text with animation */}
          <div className="h-6 overflow-hidden">
            {error && (
              <p className="mt-1.5 text-sm text-error animate-fadeInDown">{error}</p>
            )}
            {helperText && !error && (
              <p className="mt-1.5 text-sm text-text-muted animate-fadeInDown">{helperText}</p>
            )}
          </div>
        </div>
      );
    }

    if (variant === 'filled') {
      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-text-primary mb-2 transition-colors duration-200"
            >
              {label}
            </label>
          )}
          <div className="relative group">
            {leftIcon && (
              <div className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200",
                isFocused ? "text-primary scale-110" : "text-text-muted"
              )}>
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              id={inputId}
              className={cn(
                'flex w-full rounded-xl bg-surface-elevated px-4 py-3 text-sm text-text-primary',
                'transition-all duration-300 ease-out',
                'placeholder:text-text-muted',
                'focus:outline-none focus:bg-surface focus:ring-2 focus:ring-primary/30 focus:shadow-lg focus:shadow-primary/5',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'border-2 border-transparent',
                error
                  ? 'focus:ring-error/30 bg-error-light/30'
                  : isFocused ? 'border-primary' : 'hover:bg-surface',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                className
              )}
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            {rightIcon && (
              <div className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
                isFocused ? "text-primary scale-110" : "text-text-muted"
              )}>
                {rightIcon}
              </div>
            )}
          </div>
          
          <div className="h-6 overflow-hidden">
            {error && (
              <p className="mt-1.5 text-sm text-error animate-fadeInDown">{error}</p>
            )}
            {helperText && !error && (
              <p className="mt-1.5 text-sm text-text-muted animate-fadeInDown">{helperText}</p>
            )}
          </div>
        </div>
      );
    }

    // Default variant
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium mb-2 transition-colors duration-200",
              error ? "text-error" : isFocused ? "text-primary" : "text-text-primary"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200",
              isFocused ? "text-primary scale-110" : "text-text-muted group-hover:text-text-secondary"
            )}>
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary',
              'transition-all duration-300 ease-out',
              'placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary/30',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-elevated',
              error
                ? 'border-error focus:ring-error/30 focus:border-error'
                : isFocused 
                  ? 'border-primary shadow-md shadow-primary/10 ring-primary/30' 
                  : 'border-border hover:border-border-dark',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && (
            <div className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
              isFocused ? "text-primary scale-110" : "text-text-muted group-hover:text-text-secondary"
            )}>
              {rightIcon}
            </div>
          )}
          
          {/* Animated border glow */}
          <div className={cn(
            "absolute inset-0 rounded-xl border-2 border-primary/20 opacity-0 transition-opacity duration-300 pointer-events-none",
            isFocused && "opacity-100"
          )} />
        </div>
        
        <div className="h-6 overflow-hidden">
          {error && (
            <p className="mt-1.5 text-sm text-error animate-fadeInDown flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-1.5 text-sm text-text-muted animate-fadeInDown">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium mb-2 transition-colors duration-200",
              error ? "text-error" : isFocused ? "text-primary" : "text-text-primary"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <textarea
            id={inputId}
            className={cn(
              'flex w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary min-h-[120px]',
              'transition-all duration-300 ease-out resize-none',
              'placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary/30',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-elevated',
              error
                ? 'border-error focus:ring-error/30 focus:border-error'
                : isFocused 
                  ? 'border-primary shadow-md shadow-primary/10' 
                  : 'border-border hover:border-border-dark',
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
        </div>
        
        <div className="h-6 overflow-hidden">
          {error && (
            <p className="mt-1.5 text-sm text-error animate-fadeInDown">{error}</p>
          )}
          {helperText && !error && (
            <p className="mt-1.5 text-sm text-text-muted animate-fadeInDown">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
