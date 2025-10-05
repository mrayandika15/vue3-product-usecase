<template>
  <div class="mx-auto p-6 space-y-6" style="background-color: #fafafa">
    <router-link to="/" class="text-gray-500 hover:text-gray-700">
      <div class="flex items-center gap-2">
        ←
        <span class="text-lg font-semibold">Tambah Barang Baru</span>
      </div>
    </router-link>
    >

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

const router = useRouter();
const message = useMessage();

type FormModel = {
  name: string;
  description: string;
  category: string | null;
  file: File | null;
  price: number;
  sku: string;
  unit: string;
  selectedAddOn: string | null;
  addOnsSelected: { label: string; value: string; status: boolean }[];
};

const model = reactive<FormModel>({
  name: "",
  description: "",
  category: null,
  file: null,
  price: 0,
  sku: "",
  unit: "",
  selectedAddOn: null,
  addOnsSelected: [],
});

const handleFormSubmit = () => {
  message.success("Barang berhasil disimpan (mock)");
  router.push("/");
};
</script>

<style scoped></style>
