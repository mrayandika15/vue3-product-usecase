export interface Product {
  id: string
  name: string
  price: number
  category: string
  updatedAt: string
  isActive: boolean
}

export interface ProductFilters {
  search: string
  tampilkan: number
  sortBy: 'name' | 'price' | 'updatedAt'
  sortOrder: 'asc' | 'desc'
}

export interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  filters: ProductFilters
}