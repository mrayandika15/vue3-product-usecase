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

// Detail response specific types (matches DETAIL_PRODUCT_RESPONSE.json)
export interface AddOnGroup {
  id: number;
  identifier: string;
  name: string;
  is_active: number;
  updated_at: string;
  add_on_item_count: number;
}

export interface ProductAddOnLink {
  id: number;
  product_item_id: number;
  product_item_add_on_group_id: number;
  position: number;
  is_active: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  add_on_group: AddOnGroup;
}

export interface ProductDetail {
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
  add_on_link: ProductAddOnLink[];
  combines: unknown[];
  variant_item: unknown[];
  category: Category;
  variant: unknown[];

  // Optional UI helpers for consistency with Product
  children?: Product[];
  isVariant?: boolean;
}

export interface ProductDetailResponse {
  meta: ApiMeta;
  data: ProductDetail;
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
  id: number | null; // UI-selected add-on group id
  is_active: boolean | null; // active flag
  // Edit API-specific fields (optional for UI, populated in edit flow)
  id_add_on_group?: number | null; // required when status 'A'
  id_add_on_link?: number | null; // required when status 'E'|'N'|'D'
  status?: "D" | "E" | "A" | "N"; // operation flag
  position?: number | null; // unique order among add-ons
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

// Edit / Update Request Types
export interface ProductEditRequest extends ProductCreateRequest {
  id: number; // target product id
  // Required variant flags for edit API
  variant_remake: boolean; // required, default false
  variant_clear: boolean; // required, default false
  variant_change: boolean; // required, default false
}

// Form model used in Edit flow (adds id)
export interface ProductEditFormModel extends ProductCreateFormModel {
  id: number;
  variant_remake: boolean;
  variant_clear: boolean;
  variant_change: boolean;
}

// Submit payload for edit before FormData transformation
export interface ProductEditSubmitPayload {
  data_barang: ProductEditRequest;
  gambar?: File | string; // optional image for updates
}
