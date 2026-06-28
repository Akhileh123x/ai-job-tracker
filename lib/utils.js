// lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Utility helper to cleanly format numerical inputs or text 
 * into Indian Rupee currency strings (e.g., 120000 -> ₹1,20,000)
 */
export function formatCurrency(value) {
  if (!value) return "";
  
  // Checks if the value is already a formatted string with a rupee symbol
  if (typeof value === "string" && (value.includes("₹") || value.includes("Rs"))) return value;
  
  const number = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  
  if (isNaN(number)) return value;

  // Uses en-IN locale to get the correct lakhs/crores formatting comma placement
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0, // Keeps it clean (no paise)
  }).format(number);
}