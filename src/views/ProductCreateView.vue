<template>
  <div style="background-color: #fafafa">
    <PageHeader title="Tambah Barang Baru" to="/" />
    <div class="w-full p-6 space-y-6">
      <ProductForm
        :model="model"
        @submit="handleFormSubmit"
        @cancel="router.back()"
      />

      <!-- Confirmation dialog before submitting -->
      <n-modal
        :show="showConfirm"
        preset="dialog"
        title="Konfirmasi"
        :mask-closable="false"
        :closable="false"
      >
        <div class="space-y-4">
          <p>Apakah Anda yakin ingin menyimpan barang ini?</p>
          <div class="flex justify-end gap-2">
            <n-button quaternary @click="cancelConfirm" :disabled="isSubmitting"
              >Batal</n-button
            >
            <n-button
              type="primary"
              @click="confirmSubmit"
              :loading="isSubmitting"
              >OK</n-button
            >
          </div>
        </div>
      </n-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductForm from "@/components/product/ProductForm.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import { useMessage, NModal, NSpin, NButton } from "naive-ui";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { ProductCreateFormModel } from "@/types/product";
import { useCreateProduct } from "@/composables/createProduct";

const router = useRouter();
const message = useMessage();

const model = reactive<ProductCreateFormModel>({
  nama_barang: "",
  sku: "",
  harga: 0,
  kategori: null,
  unit: "",
  deskripsi: "",
  has_variant: false,
  has_addon: false,
  as_addon: false,
  add_on: [],
  file: null,
});

const { submit, isSubmitting, error: submitError } = useCreateProduct();

// Confirmation state
const showConfirm = ref(false);
const pendingModel = ref<ProductCreateFormModel | null>(null);

// Trigger confirmation first
const handleFormSubmit = (submittedModel: ProductCreateFormModel) => {
  pendingModel.value = submittedModel;
  showConfirm.value = true;
};

// Confirm and submit
const confirmSubmit = async () => {
  if (!pendingModel.value) return;
  try {
    await submit(pendingModel.value);
    message.success("Barang berhasil disimpan");
    showConfirm.value = false;
    router.push("/");
  } catch (err) {
    const msg =
      (submitError?.value as any)?.message ||
      (err as any)?.message ||
      "Gagal menyimpan barang";
    message.error(msg);
  }
};

const cancelConfirm = () => {
  showConfirm.value = false;
  pendingModel.value = null;
};
</script>

<style scoped></style>
