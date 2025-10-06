<template>
  <div class="mx-auto p-6 space-y-6" style="background-color: #fafafa">
    <PageHeader :title="model.nama_barang || 'Edit Barang'" to="/" />

    <ProductForm
      :model="model"
      :show-delete="true"
      @delete="handleDeleteClick"
      @submit="handleFormSubmit"
      @cancel="router.back()"
    />

    <!-- Confirmation dialog before submitting (Edit) -->
    <n-modal
      :show="showConfirm"
      preset="dialog"
      title="Konfirmasi"
      :mask-closable="false"
      :closable="false"
    >
      <div class="space-y-4">
        <p>Apakah Anda yakin ingin menyimpan perubahan barang ini?</p>
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

    <!-- Delete confirmation dialog (Edit only) -->
    <n-modal
      :show="showDeleteConfirm"
      preset="dialog"
      title="Hapus Barang"
      :mask-closable="false"
      :closable="false"
    >
      <div class="space-y-4">
        <p>
          Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div class="flex justify-end gap-2">
          <n-button quaternary @click="cancelDelete" :disabled="isDeleting"
            >Batal</n-button
          >
          <n-button type="error" @click="confirmDelete" :loading="isDeleting"
            >Hapus</n-button
          >
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import ProductForm from "@/components/product/ProductForm.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import { useMessage, NModal, NButton } from "naive-ui";
import { reactive, ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { ProductEditFormModel } from "@/types/product";
import { useDetailProductStore } from "@/stores/detailProductStore";
import { useDeleteProduct } from "@/composables/deleteProduct";
import { useListProductStore } from "@/stores/listProductStore";
import { useEditProduct } from "@/composables/editProducts";

const router = useRouter();
const route = useRoute();
const message = useMessage();
const detailStore = useDetailProductStore();

const model = reactive<ProductEditFormModel>({
  id: 0,
  nama_barang: "",
  sku: "",
  harga: 0,
  kategori: null,
  unit: "",
  deskripsi: "",
  has_variant: false,
  has_addon: false,
  as_addon: false,
  variant_remake: false,
  variant_clear: false,
  variant_change: false,
  add_on: [],
  file: null,
});

// Load existing product detail by id from route and populate form model
onMounted(async () => {
  const idParam = Number(route.params.id);
  if (Number.isFinite(idParam)) {
    model.id = idParam;
    const data = await detailStore.fetchProductDetail(idParam);
    if (!data) {
      message.error("Gagal memuat detail barang");
    }
  } else {
    message.error("ID barang tidak valid");
  }
});

watch(
  () => detailStore.detail,
  (d) => {
    if (!d) return;
    model.nama_barang = d.name || "";
    model.sku = d.sku || "";
    model.unit = d.unit || "";
    model.harga = d.price ?? 0;
    model.deskripsi = d.description ?? "";
    model.kategori = d.category?.id ?? null;
    model.has_variant = Boolean(d.has_variant);
    model.as_addon = Boolean(d.as_addon);
    const links = Array.isArray(d.add_on_link) ? d.add_on_link : [];
    model.has_addon = links.length > 0;
    model.add_on = links.map((link) => ({
      id: link.add_on_group?.id ?? link.product_item_add_on_group_id ?? null,
      is_active: Boolean(link.is_active),
      // populate fields needed by edit API
      id_add_on_group:
        link.add_on_group?.id ?? link.product_item_add_on_group_id ?? null,
      id_add_on_link: link.id ?? null,
      status: "E", // existing link by default
      position: link.position ?? null,
    }));
  },
  { immediate: true }
);

// Confirmation state
const showConfirm = ref(false);
const pendingModel = ref<ProductEditFormModel | null>(null);
const { isSubmitting, submit } = useEditProduct();
// Delete state
const showDeleteConfirm = ref(false);
const { isDeleting, deleteItem } = useDeleteProduct();

// Trigger confirmation first
const handleFormSubmit = () => {
  pendingModel.value = model;
  showConfirm.value = true;
};

// Confirm and submit (temporary success flow; replace with edit API)
const confirmSubmit = async () => {
  if (!pendingModel.value) return;
  try {
    await submit(model);
    message.success("Perubahan barang berhasil disimpan");
    showConfirm.value = false;
    router.push("/");
  } catch (err) {
    const msg = (err as any)?.message || "Gagal menyimpan perubahan barang";
    message.error(msg);
  }
};

const cancelConfirm = () => {
  showConfirm.value = false;
  pendingModel.value = null;
};

// Delete handlers
const handleDeleteClick = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  try {
    const idParam = Number(route.params.id);
    if (!Number.isFinite(idParam)) {
      message.error("ID barang tidak valid");
      return;
    }
    await deleteItem(idParam);
    message.success("Barang berhasil dihapus");
    showDeleteConfirm.value = false;
    router.push("/");
  } catch (err) {
    const msg = (err as any)?.message || "Gagal menghapus barang";
    message.error(msg);
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};
</script>

<style scoped></style>
