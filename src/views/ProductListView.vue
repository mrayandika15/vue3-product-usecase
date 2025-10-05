<template>
  <div class="min-h-screen px-4 py-6" style="background-color: #fafafa">
    <main
      class="max-w-7xl flex flex-col gap-2 mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <header class="flex justify-end items-center">
        <BaseButton type="primary" :icon="AddIcon" @click="handleAddProduct">
          Tambah Barang
        </BaseButton>
      </header>
      <n-card content-class="flex flex-col gap-2">
        <ProductFilters
          :filters="productStore.filters"
          :categories="productStore.categories"
          @update:filters="productStore.updateFilters"
        />
        <DataTable
          :data="productStore.products"
          :loading="productStore.loading"
          :current-page="productStore.pagination.currentPage"
          :total-pages="productStore.pagination.totalPages"
          :total-items="productStore.pagination.totalItems"
          :per-page="productStore.pagination.perPage"
          @page-change="handlePageChange"
          @empty-action="handleAddProduct"
          @row-select="handleRowSelect"
          @toggle-status="handleToggleStatus"
        />
      </n-card>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { AddOutline as AddIcon } from "@vicons/ionicons5";
import { useProductStore } from "@/stores/productStore";
import DataTable from "@/components/ui/DataTable.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProductFilters from "@/components/product/ProductFilters.vue";
import { NCard } from "naive-ui";

const productStore = useProductStore();

onMounted(async () => {
  // Load products using the new service
  await productStore.loadProducts();
});

function handleAddProduct() {
  // TODO: Implement add product modal/form
  console.log("Add product clicked");
}

function handlePageChange(page: number) {
  productStore.loadProducts(page);
}

function handleRowSelect(id: number, checked: boolean) {
  console.log(`Product ${id} selected: ${checked}`);
  // TODO: Implement row selection logic
}

function handleToggleStatus(id: number, status: boolean) {
  console.log(`Product ${id} status changed to: ${status}`);
  // TODO: Implement status toggle logic
}
</script>
