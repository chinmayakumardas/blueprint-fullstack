import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'cursor-pointer hover:bg-accent hover:text-accent-foreground',
        link: 'cursor-pointer text-primary underline-offset-4 hover:underline',
        back: 'cursor-pointer text-primary underline-offset-4 hover:underline inline-flex items-center gap-2 rounded-xl border border-green-600 bg-white px-4 py-2 text-green-700 font-semibold shadow-sm transition-all duration-200 hover:bg-green-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500',
        save: 'cursor-pointer text-primary underline-offset-4 hover:underline',
        delete: 'cursor-pointer text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };