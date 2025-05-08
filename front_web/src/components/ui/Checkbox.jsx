import React from "react";
import { cn } from "../lib/utils";

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
