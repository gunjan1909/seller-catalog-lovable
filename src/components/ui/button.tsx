import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_4px_14px_-2px_hsl(var(--primary)/0.35)] hover:bg-primary/92 hover:shadow-[0_10px_28px_-6px_hsl(var(--primary)/0.45)] hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:-translate-y-0.5 hover:shadow-lg",
        outline: "border border-border bg-card text-foreground shadow-sm hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-md hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_4px_14px_-2px_hsl(var(--secondary)/0.35)] hover:bg-secondary/92 hover:shadow-[0_10px_28px_-6px_hsl(var(--secondary)/0.45)] hover:-translate-y-0.5",
        ghost: "text-foreground hover:bg-muted hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-foreground text-background shadow-[0_6px_20px_-4px_rgba(0,0,0,0.35)] hover:bg-foreground/90 hover:shadow-[0_14px_32px_-6px_rgba(0,0,0,0.45)] hover:-translate-y-0.5",
        glass: "bg-white/95 text-foreground border border-white/60 backdrop-blur-md shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)] hover:bg-white hover:shadow-[0_14px_36px_-8px_rgba(0,0,0,0.4)] hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
