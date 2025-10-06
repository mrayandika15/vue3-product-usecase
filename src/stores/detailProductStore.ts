import { ProductService } from "@/services/productService";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ProductDetail, ProductDetailResponse } from "@/types/product";
import {
  type CacheEntry,
  getCache,
  setCache,
  invalidateCache,
  gcCache,
} from "@/helpers/cache";

export const useDetailProductStore = defineStore("detailProduct", () => {
  const currentId = ref<number | null>(null);
  const detail = ref<ProductDetail | null>(null);
  const isLoading = ref(false);
  const error = ref<unknown | null>(null);

  const hasData = computed(() => !!detail.value);

  const cache = ref<Record<string, CacheEntry<ProductDetail>>>({});

  function createKey(id: number): string {
    return `detail:${id}`;
  }

  function runGc() {
    gcCache(cache.value);
  }

  async function fetchProductDetail(
    id_barang: number
  ): Promise<ProductDetail | null> {
    currentId.value = id_barang;
    isLoading.value = true;
    error.value = null;

    try {
      const key = createKey(id_barang);
      const cached = getCache(cache.value, key);
      if (cached) {
        detail.value = cached.data;
        return detail.value;
      }

      const response: ProductDetailResponse =
        await ProductService.getProductDetail(id_barang);

      detail.value = response?.data ?? null;
      if (detail.value) setCache(cache.value, key, detail.value);
      return detail.value;
    } catch (err) {
      error.value = err;
      return null;
    } finally {
      isLoading.value = false;
      runGc();
    }
  }

  async function refetch(): Promise<ProductDetail | null> {
    if (currentId.value == null) return null;
    invalidateCache(cache.value, createKey(currentId.value));
    return fetchProductDetail(currentId.value);
  }

  function invalidateCurrentCache(): void {
    if (currentId.value == null) return;
    invalidateCache(cache.value, createKey(currentId.value));
  }

  function reset(): void {
    currentId.value = null;
    detail.value = null;
    error.value = null;
    isLoading.value = false;
  }

  return {
    // state
    currentId,
    detail,
    isLoading,
    error,

    // computed
    hasData,

    // actions
    fetchProductDetail,
    refetch,
    invalidateCurrentCache,
    reset,
    runGc,
  };
});
