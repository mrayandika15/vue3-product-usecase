import { ProductService } from "@/services/productService";
import type { Category } from "@/types/product";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  type CacheEntry,
  getCache,
  setCache,
  invalidateCache,
  gcCache,
} from "@/helpers/cache";

export const useCategoryStore = defineStore("category", () => {
  const categoriesData = ref<Category[] | null>(null);
  const isLoading = ref(false);
  const error = ref<unknown | null>(null);

  const cache = ref<Record<string, CacheEntry<Category[]>>>({});
  const CATEGORY_CACHE_KEY = "categories";

  async function initialFetchCategories() {
    isLoading.value = true;
    error.value = null;
    try {
      const cached = getCache<Category[]>(cache.value, CATEGORY_CACHE_KEY);
      if (cached) {
        categoriesData.value = cached.data ?? null;
        return;
      }

      const response = await ProductService.getCategories();
      categoriesData.value = response?.data || [];
      setCache<Category[]>(cache.value, CATEGORY_CACHE_KEY, categoriesData.value);
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
      gcCache(cache.value);
    }
  }

  function refetchCategories() {
    invalidateCache(cache.value, CATEGORY_CACHE_KEY);
    initialFetchCategories();
  }

  const categories = computed<Category[]>(() => categoriesData.value || []);

  return {
    categories,
    isLoading,
    error,
    initialFetchCategories,
    refetchCategories,
  };
});