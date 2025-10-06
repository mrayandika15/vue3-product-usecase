import { ProductService } from "@/services/productService";
import type { Product, ProductQuery } from "@/types/product";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
  type CacheEntry = { data: any | null; meta: MetaCounts; timestamp: number };
  const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
  const GC_TIME_MS = 10 * 60 * 1000; // 10 minutes
  const cache = ref<Record<string, CacheEntry>>({});

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

  function getCache(key: string): CacheEntry | null {
    const entry = cache.value[key];
    if (!entry) return null;
    const age = Date.now() - entry.timestamp;
    if (age > STALE_TIME_MS) return null;
    return entry;
  }

  function setCache(key: string, data: any | null, metaCounts: MetaCounts) {
    cache.value[key] = { data, meta: metaCounts, timestamp: Date.now() };
  }

  function gcCache() {
    const now = Date.now();
    for (const k of Object.keys(cache.value)) {
      if (now - cache.value[k].timestamp > GC_TIME_MS) delete cache.value[k];
    }
  }

  async function initialFetchProduct() {
    isLoading.value = true;
    error.value = null;
    try {
      const key = createProductsQueryKey(currentPage.value, filters.value);
      const cached = getCache(key);
      if (cached) {
        meta.value = cached.meta;
        productsData.value = cached.data;
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
      setCache(key, productsData.value, meta.value);
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
      gcCache();
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
  };
});
