// import React from "react";
// import { cn } from "../lib/utils";
// import { Icon } from "@iconify/react"; // optionnel, pour une icône

// export function Alert({ title, description, className, icon, variant = "default" }) {
//   const variants = {
//     default: "bg-gray-100 text-gray-900",
//     success: "bg-green-100 text-green-900",
//     error: "bg-red-100 text-red-900",
//     warning: "bg-yellow-100 text-yellow-900",
//     info: "bg-blue-100 text-blue-900",
//   };

//   return (
//     <div
//       className={cn(
//         "w-full rounded-md p-4 flex items-start gap-3 border",
//         variants[variant],
//         className
//       )}
//     >
//       {icon && <Icon icon={icon} className="mt-1 text-xl" />}
//       <div>
//         {title && <p className="font-medium">{title}</p>}
//         {description && <p className="text-sm mt-1">{description}</p>}
//       </div>
//     </div>
//   );
// }



import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({ className, variant = "default", ...props }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
