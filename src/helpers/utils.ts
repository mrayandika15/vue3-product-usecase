// Utility functions for formatting and data manipulation

import { Product } from "@/types/product";

// Format price to Indonesian Rupiah
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Format date to DD/MM/YYYY HH:mm format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Get status badge color
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "inactive":
      return "error";
    default:
      return "default";
  }
}
