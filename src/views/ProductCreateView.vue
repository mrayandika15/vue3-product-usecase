<template>
  <div class="mx-auto p-6 space-y-6" style="background-color: #fafafa">
    <router-link to="/" class="text-gray-500 hover:text-gray-700">
      <div class="flex items-center gap-2">
        ←
        <span class="text-lg font-semibold">Tambah Barang Baru</span>
      </div>
    </router-link>

    <ProductForm
      :model="model"
      @submit="handleFormSubmit"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import ProductForm from "@/components/product/ProductForm.vue";
import { useMessage } from "naive-ui";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import type { ProductCreateFormModel } from "@/types/product";

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

const handleFormSubmit = () => {
  message.success("Barang berhasil disimpan (mock)");
  router.push("/");
};
</script>

<style scoped></style>
