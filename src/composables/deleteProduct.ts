import { ProductService } from "@/services/productService";
import { useListProductStore } from "@/stores/listProductStore";
import { ref } from "vue";

// Request body: { item: number }
interface DeleteProductRequest {
  item: number;
}

export function useDeleteProduct() {
  const isDeleting = ref(false);
  const error = ref<unknown | null>(null);
  const result = ref<unknown | null>(null);
  const productStore = useListProductStore();

  async function deleteItem(id: number) {
    isDeleting.value = true;
    error.value = null;
    result.value = null;

    try {
      const body: DeleteProductRequest = { item: id };
      const response = await ProductService.deleteProduct(body.item);
      result.value = response ?? null;

      productStore.invalidateCacheForCurrentFilters();
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      isDeleting.value = false;
    }
  }

  return {
    isDeleting,
    error,
    result,
    deleteItem,
  };
}
