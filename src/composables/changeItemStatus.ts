import { ProductService } from "@/services/productService";
import { useListProductStore } from "@/stores/listProductStore";
import { useDetailProductStore } from "@/stores/detailProductStore";
import { ref } from "vue";

// Request body: { id_barang: number; status: "ON" | "OFF" }
export type ItemStatus = "ON" | "OFF";
interface ChangeItemStatusRequest {
  id_barang: number;
  status: ItemStatus;
}

export function useChangeItemStatus() {
  const isChanging = ref(false);
  const error = ref<unknown | null>(null);
  const result = ref<unknown | null>(null);

  const listStore = useListProductStore();
  const detailStore = useDetailProductStore();

  async function changeStatus(id_barang: number, status: ItemStatus) {
    isChanging.value = true;
    error.value = null;
    result.value = null;

    try {
      const body: ChangeItemStatusRequest = { id_barang, status };
      const response = await ProductService.changeItemStatus(
        body.id_barang,
        body.status
      );
      result.value = response ?? null;

      // Invalidate related caches to reflect status change in UI
      listStore.invalidateCacheForCurrentFilters?.();
      detailStore.invalidateCurrentCache?.();

      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      isChanging.value = false;
    }
  }

  return {
    isChanging,
    error,
    result,
    changeStatus,
  };
}