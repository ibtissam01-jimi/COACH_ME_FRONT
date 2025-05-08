import React from "react";
import { cn } from "../lib/utils";
import { Icon } from "@iconify/react"; // optionnel, pour une icône

export function Alert({ title, description, className, icon, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    success: "bg-green-100 text-green-900",
    error: "bg-red-100 text-red-900",
    warning: "bg-yellow-100 text-yellow-900",
    info: "bg-blue-100 text-blue-900",
  };

  return (
    <div
      className={cn(
        "w-full rounded-md p-4 flex items-start gap-3 border",
        variants[variant],
        className
      )}
    >
      {icon && <Icon icon={icon} className="mt-1 text-xl" />}
      <div>
        {title && <p className="font-medium">{title}</p>}
        {description && <p className="text-sm mt-1">{description}</p>}
      </div>
    </div>
  );
}
