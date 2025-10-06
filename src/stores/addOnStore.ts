import { ProductService } from "@/services/productService";
import type { AddOnListItem } from "@/types/product";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  type CacheEntry,
  getCache,
  setCache,
  invalidateCache,
  gcCache,
} from "@/helpers/cache";

export const useAddOnStore = defineStore("addOn", () => {
  const addOnsData = ref<AddOnListItem[] | null>(null);
  const isLoading = ref(false);
  const error = ref<unknown | null>(null);

  const cache = ref<Record<string, CacheEntry<AddOnListItem[]>>>({});
  const ADDONS_CACHE_KEY = "addons";

  async function initialFetchAddOns() {
    isLoading.value = true;
    error.value = null;
    try {
      const cached = getCache<AddOnListItem[]>(cache.value, ADDONS_CACHE_KEY);
      if (cached) {
        addOnsData.value = cached.data ?? null;
        return;
      }

      const response = await ProductService.getAddOns();
      addOnsData.value = response?.data || [];
      setCache<AddOnListItem[]>(cache.value, ADDONS_CACHE_KEY, addOnsData.value);
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
      gcCache(cache.value);
    }
  }

  function refetchAddOns() {
    invalidateCache(cache.value, ADDONS_CACHE_KEY);
    initialFetchAddOns();
  }

  const addOns = computed<AddOnListItem[]>(() => addOnsData.value || []);

  return {
    addOns,
    isLoading,
    error,
    initialFetchAddOns,
    refetchAddOns,
  };
});