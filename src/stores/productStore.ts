import { ProductService } from "@/services/productService";
import type { Product, ProductFilters } from "@/types/product";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useProductStore = defineStore("product", () => {
  // State
  const products = ref<Product[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });

  const filters = ref<ProductFilters>({
    search: "",
    tampilkan: 10,
    sortBy: "name",
    sortOrder: "asc",
  });

  // Getters
  const filteredProducts = computed(() => {
    let filtered = [...products.value];

    // Filter by search
    if (filters.value.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.value.search.toLowerCase())
      );
    }

    // Filter by tampilkan (limit results)
    if (filters.value.tampilkan) {
      filtered = filtered.slice(0, filters.value.tampilkan);
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[filters.value.sortBy] as string | number;
      const bValue = b[filters.value.sortBy] as string | number;

      if (filters.value.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  });

  const categories = computed(() => {
    const uniqueCategories = [
      ...new Set(
        products.value.map((p) => p.category?.name || "Uncategorized")
      ),
    ];
    return uniqueCategories.sort();
  });

  // Actions
  async function loadProducts(page: number = 1) {
    try {
      setLoading(true);
      setError(null);

      const response = await ProductService.getProducts(
        page,
        pagination.value.perPage
      );

      products.value = response.data.data;
      pagination.value = {
        currentPage: response.data.current_page,
        totalPages: response.data.last_page || 1,
        totalItems: response.data.total || 0,
        perPage: response.data.per_page || 10,
      };
    } catch (err) {
      setError("Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }

  function setProducts(newProducts: Product[]) {
    products.value = newProducts;
  }

  function addProduct(product: Product) {
    products.value.push(product);
  }

  function updateProduct(id: number, updatedProduct: Partial<Product>) {
    const index = products.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updatedProduct };
    }
  }

  function deleteProduct(id: number) {
    const index = products.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.value.splice(index, 1);
    }
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading;
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage;
  }

  function updateFilters(newFilters: Partial<ProductFilters>) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function resetFilters() {
    filters.value = {
      search: "",
      tampilkan: 10,
      sortBy: "name",
      sortOrder: "asc",
    };
  }

  // Initialize with mock data (legacy support)
  function initializeMockData() {
    // Use the new loadProducts method instead
    loadProducts();
  }

  return {
    // State
    products,
    loading,
    error,
    filters,
    pagination,
    // Getters
    filteredProducts,
    categories,
    // Actions
    loadProducts,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setLoading,
    setError,
    updateFilters,
    resetFilters,
    initializeMockData,
  };
});
