import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductFilters } from '@/types/product'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  const filters = ref<ProductFilters>({
    search: '',
    tampilkan: 10,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // Getters
  const filteredProducts = computed(() => {
    let filtered = [...products.value]

    // Filter by search
    if (filters.value.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.value.search.toLowerCase())
      )
    }

    // Filter by tampilkan (limit results)
    if (filters.value.tampilkan) {
      filtered = filtered.slice(0, filters.value.tampilkan)
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[filters.value.sortBy]
      const bValue = b[filters.value.sortBy]
      
      if (filters.value.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  })

  const categories = computed(() => {
    const uniqueCategories = [...new Set(products.value.map(p => p.category))]
    return uniqueCategories.sort()
  })

  // Actions
  function setProducts(newProducts: Product[]) {
    products.value = newProducts
  }

  function addProduct(product: Product) {
    products.value.push(product)
  }

  function updateProduct(id: string, updatedProduct: Partial<Product>) {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updatedProduct }
    }
  }

  function deleteProduct(id: string) {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function updateFilters(newFilters: Partial<ProductFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      tampilkan: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  }

  // Initialize with mock data
  function initializeMockData() {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Laptop Gaming ASUS ROG',
        price: 15000000,
        category: 'Elektronik',
        updatedAt: '2024-01-15',
        isActive: true
      },
      {
        id: '2',
        name: 'Smartphone Samsung Galaxy',
        price: 8000000,
        category: 'Elektronik',
        updatedAt: '2024-01-14',
        isActive: true
      },
      {
        id: '3',
        name: 'Sepatu Nike Air Max',
        price: 2500000,
        category: 'Fashion',
        updatedAt: '2024-01-13',
        isActive: false
      }
    ]
    setProducts(mockProducts)
  }

  return {
    // State
    products,
    loading,
    error,
    filters,
    // Getters
    filteredProducts,
    categories,
    // Actions
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setLoading,
    setError,
    updateFilters,
    resetFilters,
    initializeMockData
  }
})