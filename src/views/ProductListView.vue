<template>
  <div class="min-h-screen bg-gray-50 px-4 py-6">
    <main class="max-w-7xl flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header class="flex justify-end items-center">
        <BaseButton type="primary" :icon="AddIcon" @click="handleAddProduct">
          Tambah Barang
        </BaseButton>
      </header>
      <n-card>
        <ProductFilters
          :filters="productStore.filters"
          :categories="productStore.categories"
          @update:filters="productStore.updateFilters"
        />
        <DataTable
          title="Daftar Produk"
          :columns="tableColumns as any"
          :data="productStore.filteredProducts"
          :loading="productStore.loading"
          row-key="id"
          empty-title="Barang masih kosong"
          empty-description="Tambah barang untuk mulai mengelola produk Anda."
        >
        </DataTable>
      </n-card>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h } from "vue";
import { NTag, NSpace } from "naive-ui";
import { AddOutline as AddIcon } from "@vicons/ionicons5";
import { useProductStore } from "@/stores/productStore";
import DataTable from "@/components/ui/DataTable.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProductFilters from "@/components/product/ProductFilters.vue";
import type { DataTableColumns } from "naive-ui";
import type { Product } from "@/types/product";

const productStore = useProductStore();

const tableColumns: DataTableColumns<Product> = [
  {
    title: "Nama Barang",
    key: "name",
    sorter: true,
    render: (row) => h("div", { class: "font-medium text-gray-900" }, row.name),
  },
  {
    title: "Harga",
    key: "price",
    sorter: true,
    render: (row) =>
      h("div", { class: "text-gray-900" }, formatCurrency(row.price)),
  },
  {
    title: "Kategori",
    key: "category",
    render: (row) =>
      h(NTag, { type: "info", size: "small" }, { default: () => row.category }),
  },
  {
    title: "Tanggal Diperbarui",
    key: "updatedAt",
    sorter: true,
    render: (row) =>
      h("div", { class: "text-gray-600" }, formatDate(row.updatedAt)),
  },
  {
    title: "Status",
    key: "isActive",
    render: (row) =>
      h(
        NTag,
        {
          type: row.isActive ? "success" : "warning",
          size: "small",
        },
        { default: () => (row.isActive ? "Aktif" : "Tidak Aktif") }
      ),
  },
  {
    title: "Tindakan",
    key: "actions",
    width: 150,
    render: (row) =>
      h(
        NSpace,
        { size: "small" },
        {
          default: () => [
            h(
              BaseButton,
              {
                size: "small",
                type: "info",
                onClick: () => handleEditProduct(row.id),
              },
              { default: () => "Edit" }
            ),
            h(
              BaseButton,
              {
                size: "small",
                type: "error",
                onClick: () => handleDeleteProduct(row.id),
              },
              { default: () => "Hapus" }
            ),
          ],
        }
      ),
  },
];

onMounted(() => {
  // Initialize with mock data
  productStore.initializeMockData();
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function handleAddProduct() {
  // TODO: Implement add product modal/form
  console.log("Add product clicked");
}

function handleEditProduct(id: string) {
  // TODO: Implement edit product modal/form
  console.log("Edit product:", id);
}

function handleDeleteProduct(id: string) {
  // TODO: Implement delete confirmation
  console.log("Delete product:", id);
}
</script>
