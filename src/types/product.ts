// API Response Types
export interface ApiMeta {
  code: number;
  status: string;
  message: string;
}

export interface Category {
  id: number;
  name: string;
  created_by: string;
  updated_by: string | null;
}

export interface Product {
  id: number;
  sku: string;
  barcode: string | null;
  unit: string;
  name: string;
  description: string | null;
  price: number;
  discount: number;
  price_discount: number;
  is_active: number;
  has_variant: number;
  as_addon: number;
  variant_status: string;
  addon_status: string;
  image: string | null;
  total_sku: number;
  status: string;
  available_data: unknown | null;
  created_by: string;
  updated_at: string;
  add_on_link_count: number;
  category: Category;
  combines: unknown[];
  variant_item: unknown[];
  variant: unknown[];

  // Transformed data for tree structure
  children?: Product[];
  isVariant?: boolean;
}

// UI State Types
export interface ProductFilters {
  search: string;
  tampilkan: number;
  sortBy: keyof Product;
  sortOrder: "asc" | "desc";
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}
