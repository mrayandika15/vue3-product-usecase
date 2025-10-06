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

// Category API response shape (matches CATEGORY_RESPONSE.json)
export interface CategoryListResponse {
  meta: ApiMeta;
  data: Category[];
}

// AddOn list item from ADDONS_RESPONSE.json
export interface AddOnListItem {
  id: number;
  identifier: string;
  name: string;
  is_active: number;
  updated_at: string;
  add_on_item_count: number;
}

// AddOn API response shape (matches ADDONS_RESPONSE.json)
export interface AddOnListResponse {
  meta: ApiMeta;
  data: AddOnListItem[];
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
export interface ProductQuery {
  search: string;
  page_count: number;
  active?: number | null | undefined;
  page: number;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductQuery;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}

// Create / Form Request Types
export interface AddOnItem {
  id: number | null; // nullable numeric id
  is_active: boolean | null; // nullable boolean status
}

// Payload shape expected by backend for product creation
export interface ProductCreateRequest {
  nama_barang: string; // required|min:3|max:50
  sku: string; // required|min:1|max:20
  harga: number; // required|numeric
  kategori: number | null; // required|numeric
  unit: string; // required|min:1|max:20
  deskripsi: string | null; // nullable
  has_variant: boolean; // required (default false)
  barcode: null;
  has_addon: boolean; // required (true if add_on exists)
  as_addon: boolean; // required (default false)
  add_on: AddOnItem[] | null; // nullable|array
}

// Form model used in UI (extends request with local-only fields)
export interface ProductCreateFormModel extends ProductCreateRequest {
  file: File | null; // local image upload, not part of payload
}

// Submit payload shape before FormData transformation
export interface ProductCreateSubmitPayload {
  data_barang: ProductCreateRequest;
  gambar: File | string; // image file preferred; string fallback only if API allows
}
