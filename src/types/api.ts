// Common API Response Types
export interface ApiMeta {
  code: number;
  status: string;
  message: string;
}

export interface ListPaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  links?: PaginationLink[];
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number;
  total?: number;
}

export interface PaginationLink {
  url?: string | null;
  label: string;
  active: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Product API specific types
export interface ProductListRequest {
  search?: string;
  tampilkan?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T;
  count_all: number;
  count_active: number;
  count_non_active: number;
}
