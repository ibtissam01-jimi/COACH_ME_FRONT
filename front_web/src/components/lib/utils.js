// lib/utils.js
// export function cn(...inputs) {
//     return inputs.filter(Boolean).join(" ");
//   }

import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(...inputs);
}

  

