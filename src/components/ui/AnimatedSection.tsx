import * as React from 'react';
import { cn } from '@/utils';

type AnimationType = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  children: React.ReactNode;
}

const animationClasses: Record<AnimationType, { initial: string; animated: string }> = {
  fadeIn: {
    initial: 'opacity-0',
    animated: 'opacity-100',
  },
  fadeInUp: {
    initial: 'opacity-0 translate-y-8',
    animated: 'opacity-100 translate-y-0',
  },
  fadeInDown: {
    initial: 'opacity-0 -translate-y-8',
    animated: 'opacity-100 translate-y-0',
  },
  fadeInLeft: {
    initial: 'opacity-0 -translate-x-8',
    animated: 'opacity-100 translate-x-0',
  },
  fadeInRight: {
    initial: 'opacity-0 translate-x-8',
    animated: 'opacity-100 translate-x-0',
  },
  scaleIn: {
    initial: 'opacity-0 scale-95',
    animated: 'opacity-100 scale-100',
  },
  slideInUp: {
    initial: 'translate-y-full opacity-0',
    animated: 'translate-y-0 opacity-100',
  },
};

const AnimatedSection = React.forwardRef<HTMLDivElement, AnimatedSectionProps>(
  (
    {
      className,
      animation = 'fadeInUp',
      delay = 0,
      duration = 600,
      threshold = 0.1,
      triggerOnce = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const internalRef = React.useRef<HTMLDivElement>(null);
    const elementRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    React.useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { threshold }
      );

      observer.observe(element);

      return () => observer.disconnect();
    }, [threshold, triggerOnce, elementRef]);

    const animationConfig = animationClasses[animation];

    return (
      <div
        ref={elementRef}
        className={cn(
          'transition-all ease-out',
          isVisible ? animationConfig.animated : animationConfig.initial,
          className
        )}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedSection.displayName = 'AnimatedSection';

// Staggered children animation wrapper
interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number;
  animation?: AnimationType;
  children: React.ReactNode;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  className,
  staggerDelay = 100,
  animation = 'fadeInUp',
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const animationConfig = animationClasses[animation];

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {React.Children.map(children, (child, index) => (
        <div
          className={cn(
            'transition-all ease-out',
            isVisible ? animationConfig.animated : animationConfig.initial
          )}
          style={{
            transitionDuration: '600ms',
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Counter animation component
interface CounterProps {
  end: number;
  duration?: number;
  start?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  end,
  duration = 2000,
  start = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const [count, setCount] = React.useState(start);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, start, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Typewriter effect
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorClassName?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  className,
  cursorClassName,
}) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayedText}
      <span
        className={cn(
          'inline-block w-0.5 h-[1em] bg-current ml-0.5',
          isTyping ? 'animate-pulse' : 'animate-blink',
          cursorClassName
        )}
        style={{
          animation: isTyping ? 'none' : 'blink 1s infinite',
        }}
      />
    </span>
  );
};

export { AnimatedSection, StaggerContainer, Counter, Typewriter };
