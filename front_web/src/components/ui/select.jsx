import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { tv } from "tailwind-variants";
import { cn } from "../lib/utils"; // Assurez-vous d'avoir cette fonction utilitaire pour fusionner les classes

// Assurez-vous d'importer les icônes
import { ChevronUp, ChevronDown } from 'lucide-react'; // Pour lucide-react
import { Check } from 'lucide-react'; // Pour le check

const selectVariants = tv({
  base: "inline-flex items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    size: {
      default: "h-10",
      sm: "h-9",
      lg: "h-12",
    },
    color: {
      default: "border-gray-300 focus:ring-blue-500",
      primary: "border-blue-500 focus:ring-blue-600",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className, size, color, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectVariants({ size, color }), className)}
    {...props}
  />
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 rounded-md border bg-white shadow-md",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
        <ChevronUp className="h-4 w-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">
        {props.children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
        <ChevronDown className="h-4 w-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ children, className, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex items-center pl-8 pr-2 py-1.5 text-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100",
      className
    )}
    {...props}
  >
    <span className="absolute left-2">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem
};
