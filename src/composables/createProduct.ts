import { ref } from "vue";
import { ProductService } from "@/services/productService";
import type {
  ProductCreateFormModel,
  ProductCreateRequest,
  ProductCreateSubmitPayload,
} from "@/types/product";

export function useCreateProduct() {
  const isSubmitting = ref(false);
  const error = ref<unknown | null>(null);
  const result = ref<unknown | null>(null);

  async function submit(model: ProductCreateFormModel) {
    isSubmitting.value = true;
    error.value = null;
    result.value = null;

    try {
      const request: ProductCreateRequest = {
        nama_barang: model.nama_barang,
        kategori: model.kategori,
        sku: model.sku,
        barcode: null, // explicitly null per spec
        harga: model.harga,
        unit: model.unit,
        deskripsi: model.deskripsi ?? null,
        as_addon: !!model.as_addon,
        add_on: model.add_on ?? [],
        has_addon: !!(model.add_on && model.add_on.length > 0),
        has_variant: !!model.has_variant,
      };

      // Validate required image file and type
      const file = model.file;
      if (!file) {
        throw new Error("Foto Barang wajib diupload");
      }
      const allowedTypes = ["image/jpeg", "image/png"]; // jpeg covers jpg
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Format gambar tidak didukung (jpeg/jpg/png)");
      }

      const payload: ProductCreateSubmitPayload = {
        data_barang: request,
        gambar: file,
      };

      const formData = new FormData();
      formData.append("data_barang", JSON.stringify(payload.data_barang));
      formData.append("gambar", file, file.name);

      const response = await ProductService.createProduct(formData);
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