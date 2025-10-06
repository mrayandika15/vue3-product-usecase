import { ref } from "vue";
import { ProductService } from "@/services/productService";

// Request body: { item: number }
interface DeleteProductRequest {
  item: number;
}

export function useDeleteProduct() {
  const isDeleting = ref(false);
  const error = ref<unknown | null>(null);
  const result = ref<unknown | null>(null);

  async function deleteItem(id: number) {
    isDeleting.value = true;
    error.value = null;
    result.value = null;

    try {
      const body: DeleteProductRequest = { item: id };
      const response = await ProductService.deleteProduct(body.item);
      result.value = response ?? null;
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