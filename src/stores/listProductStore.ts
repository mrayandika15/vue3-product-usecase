import { ProductService } from "@/services/productService";
import type { Product, ProductQuery } from "@/types/product";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  type CacheEntry,
  getCache,
  setCache,
  gcCache,
} from "@/helpers/cache";

export const useListProductStore = defineStore("product", () => {
  const currentPage = ref(1);
  const meta = ref({
    activeCount: 0,
    inactiveCount: 0,
    count: 0,
  });

  // State for filters
  const filters = ref<ProductQuery>({
    search: "",
    page_count: 10,
    active: null,
    page: currentPage.value,
  });

  // Local state replacing Vue Query
  const productsData = ref<any | null>(null);
  const isLoading = ref(false);
  const error = ref<unknown | null>(null);


  // Simple in-store cache
  type MetaCounts = {
    activeCount: number;
    inactiveCount: number;
    count: number;
  };
  const cache = ref<Record<string, CacheEntry<{ data: any | null; meta: MetaCounts }>>>({});

  function createProductsQueryKey(
    page: number,
    currentFilters: ProductQuery
  ): string {
    return JSON.stringify([
      "products",
      page,
      currentFilters.search || "",
      currentFilters.page_count,
      currentFilters.active ?? null,
    ]);
  }

  function runGc() {
    gcCache(cache.value);
  }

  async function initialFetchProduct() {
    isLoading.value = true;
    error.value = null;
    try {
      const key = createProductsQueryKey(currentPage.value, filters.value);
      const cached = getCache(cache.value, key);
      if (cached) {
        meta.value = cached.data.meta;
        productsData.value = cached.data.data;
        return;
      }

      const response = await ProductService.getProducts({
        ...filters.value,
        page: currentPage.value,
      });

      meta.value = {
        activeCount: response?.count_active || 0,
        inactiveCount: response?.count_non_active || 0,
        count: response?.count_all || 0,
      };

      productsData.value = response?.data ?? null;

      // save to cache
      setCache(cache.value, key, { data: productsData.value, meta: meta.value });
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
      runGc();
    }
  }


  // Computed properties
  const products = computed<Product[]>(() => productsData.value?.data || []);


  const pagination = computed(() => ({
    currentPage: productsData.value?.current_page,
    totalPages: productsData.value?.last_page,
    totalItems: productsData.value?.total,
    perPage: productsData.value?.per_page,
  }));

  // Actions
  function updateFilters(newFilters: Partial<ProductQuery>) {
    filters.value = { ...filters.value, ...newFilters };
    // Reset to page 1 when filters change
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
    // keep filters.page in sync
    filters.value.page = 1;
  }

  function setPage(page: number) {
    currentPage.value = page;
    // keep filters.page in sync
    filters.value.page = page;
  }

  // Invalidate and refetch products (traditional Pinia way)

  function refetch() {
    initialFetchProduct();
  }


  return {
    // State
    filters,
    currentPage,

    // Computed
    products,
    meta,
    pagination,
    isLoading,
    error,

    // Actions
    updateFilters,
    setPage,
    refetch,
    initialFetchProduct,
    runGc,
  };
});
