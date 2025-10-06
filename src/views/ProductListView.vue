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
          :meta="productStore.meta"
          :active-tab="activeTab"
          :search-value="searchValue"
          :page-count="pageCount"
          @tab-change="handleTabChange"
          @search-change="handleSearchChange"
          @page-count-change="handlePageCountChange"
        />
        <DataTable
          :data="productStore.products"
          :loading="productStore.isLoading"
          :current-page="productStore.pagination.currentPage"
          :total-pages="productStore.pagination.totalPages"
          :total-items="productStore.pagination.totalItems"
          :per-page="productStore.pagination.perPage"
          @page-change="handlePageChange"
          @empty-action="handleAddProduct"
          @toggle-status="handleToggleStatus"
        />
      </n-card>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { AddOutline as AddIcon } from "@vicons/ionicons5";
import { useListProductStore } from "@/stores/listProductStore";
import { useChangeItemStatus } from "@/composables/changeItemStatus";

import DataTable from "@/components/ui/DataTable.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProductFilters from "@/components/product/ProductFilters.vue";
import { NCard } from "naive-ui";
import router from "@/router";

const productStore = useListProductStore();
const { changeStatus } = useChangeItemStatus();

// Local state for filters
const activeTab = ref<string>("all");
const searchValue = ref<string>(productStore.filters.search);
const pageCount = ref<number>(productStore.filters.page_count);

onMounted(async () => {
  productStore.initialFetchProduct();
});

function handleAddProduct() {
  router.push({ name: "AddProduct" });
}

function handlePageChange(page: number) {
  productStore.setPage(page);
  productStore.refetch();
}

// Filter event handlers moved from ProductFilters component
function handleSearchChange(value: string) {
  productStore.updateFilters({ search: value });
  productStore.setPage(1);
  productStore.refetch();
}

function handlePageCountChange(value: number) {
  productStore.updateFilters({ page_count: value });
  productStore.setPage(1);
  productStore.refetch();
}

function handleTabChange(tab: string) {
  activeTab.value = tab;
  productStore.updateFilters({
    active: tab === "all" ? null : Number(tab),
  });
  productStore.setPage(1);
  productStore.refetch();
}

// Toggle ON/OFF status for a product item
async function handleToggleStatus(id: number, value: boolean) {
  const status = value ? "ON" : "OFF";
  try {
    await changeStatus(id, status);
    // Refetch list to reflect latest server state
    await productStore.refetch();
  } catch (err) {
    console.error("Failed to change status", err);
    // Optional: show a toast/notification here
    // Ensure list stays consistent with server
    await productStore.refetch();
  }
}
</script>
