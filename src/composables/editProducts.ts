import { ref } from "vue";
import { ProductService } from "@/services/productService";
import type {
  ProductEditFormModel,
  ProductEditRequest,
  ProductEditSubmitPayload,
  AddOnItem,
} from "@/types/product";
import { useListProductStore } from "@/stores/listProductStore";
import { useDetailProductStore } from "@/stores/detailProductStore";

export function useEditProduct() {
  const isSubmitting = ref(false);
  const error = ref<unknown | null>(null);
  const result = ref<unknown | null>(null);

  const productStore = useListProductStore();
  const detailProduct = useDetailProductStore();

  async function submit(model: ProductEditFormModel) {
    isSubmitting.value = true;
    error.value = null;
    result.value = null;

    try {
      // Normalize add_on items to required edit API shape
      const normalizedAddOns = (model.add_on ?? []).map((item, idx) => {
        const hasLink = item.id_add_on_link != null;
        const status = item.status ?? (hasLink ? "E" : "A");
        const position = item.position ?? idx + 1; // ensure unique position
        const base: Partial<AddOnItem> = {
          is_active: !!item.is_active,
          status,
          position,
        };
        if (status === "A") {
          base.id_add_on_group = item.id ?? item.id_add_on_group ?? null;
        } else {
          base.id_add_on_link = item.id_add_on_link ?? null;
        }
        return base;
      });

      const request: ProductEditRequest = {
        id: model.id,
        nama_barang: model.nama_barang,
        kategori: model.kategori,
        sku: model.sku,
        barcode: null,
        harga: model.harga,
        unit: model.unit,
        deskripsi: model.deskripsi ?? null,
        as_addon: !!model.as_addon,
        add_on: normalizedAddOns as unknown as AddOnItem[],
        has_addon: !!(model.add_on && model.add_on.length > 0),
        has_variant: !!model.has_variant,
        // Required variant flags: default to false if not set
        variant_remake: !!model.variant_remake,
        variant_clear: !!model.variant_clear,
        variant_change: !!model.variant_change,
      };

      const payload: ProductEditSubmitPayload = {
        data_barang: request,
      };

      const formData = new FormData();
      formData.append("data_barang", JSON.stringify(payload.data_barang));

      // Optional image: validate and append only if provided
      const file = model.file;
      if (file) {
        const allowedTypes = ["image/jpeg", "image/png"]; // jpeg covers jpg
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Format gambar tidak didukung (jpeg/jpg/png)");
        }
        formData.append("gambar", file, file.name);
      }

      // Invalidate cache for current filters after successful edit
      productStore.invalidateCacheForCurrentFilters();
      detailProduct.invalidateCurrentCache();
      const response = await ProductService.editProduct(formData);
      result.value = response;
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    isSubmitting,
    error,
    result,
    submit,
  };
}
