// src/components/Profile/badge.jsx
import { cva } from "class-variance-authority";
// --- CORRECTED IMPORT FOR cn ---
// Assuming cn utility is located in src/utils/cn
import { cn } from "../../utils/cn"; // Make sure this path is correct
// --- CORRECTED IMPORT END ---

// Removed unused import: import ProfileDetails from './ProfileDetails';

// Define badge variants and styles using cva
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default", // Default variant
    },
  },
);

// Badge Component
function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };