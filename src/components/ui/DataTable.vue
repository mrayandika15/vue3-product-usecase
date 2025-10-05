<template>
  <div
    class="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
  >
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="paginationConfig"
      :single-line="false"
      :bordered="false"
      :bottom-bordered="false"
      :striped="false"
      size="medium"
      :row-key="(row: Product) => row.id"
      :table-layout="'fixed'"
      :max-height="400"
      :min-height="400"
      :theme-overrides="dataTableThemeOverrides"
    >
      <template #empty>
        <EmptyState
          title="Barang masih kosong"
          description="Tambah barang untuk mulai mengelola produk Anda."
          icon-src="/box-add.png"
          action-text="Tambah Barang"
          :show-action="true"
          @action="$emit('empty-action')"
        />
      </template>
    </n-data-table>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { NDataTable, NSwitch, NTag, NIcon } from "naive-ui";
import { ImageOutline } from "@vicons/ionicons5";
import type { DataTableColumns, DataTableProps } from "naive-ui";
import type { Product } from "@/types/product";
import EmptyState from "./EmptyState.vue";
import { ProductService } from "@/services/productService";

type DataTableThemeOverrides = NonNullable<DataTableProps["themeOverrides"]>;

// Minimal theme overrides - only for removing borders
const dataTableThemeOverrides: DataTableThemeOverrides = {
  borderColor: "transparent",
};

interface Props {
  data: Product[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  perPage?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  showEmptyAction?: boolean;
  emptyActionText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  perPage: 10,
});

const emit = defineEmits<{
  "page-change": [page: number];
  "empty-action": [];
  "row-select": [id: number, checked: boolean];
  "toggle-status": [id: number, status: boolean];
}>();

const columns: DataTableColumns<Product> = [
  {
    type: "selection",
    width: 50,
  },
  {
    title: "Nama Barang",
    key: "name",
    width: 240,
    render: (row) =>
      h("div", { class: "flex gap-3 items-start py-2" }, [
        h(
          "div",
          {
            class:
              "w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0",
          },
          h(
            NIcon,
            { size: 20, color: "#9CA3AF" },
            { default: () => h(ImageOutline) }
          )
        ),
        h(
          "div",
          {
            class: "flex flex-col gap-1 min-w-0",
          },
          [
            h(
              "div",
              { class: "font-medium text-gray-900 text-sm leading-5" },
              row.name
            ),
            h(
              "div",
              { class: "text-xs text-gray-500 leading-4" },
              row.category.name
            ),
          ]
        ),
        row.has_variant
          ? h("div", { class: "flex items-center gap-1 mt-1" }, [
              h(
                NTag,
                {
                  size: "small",
                  type: "info",
                  class:
                    "text-xs text-main bg-[#EFBB6D66] !border-0 rounded-md",
                },
                { default: () => `${row.has_variant} Varian` }
              ),
              ...(row.as_addon
                ? [
                    h(
                      NTag,
                      {
                        size: "small",
                        type: "warning",
                        class: "text-xs",
                      },
                      { default: () => "3 Add On" }
                    ),
                  ]
                : []),
            ])
          : null,
      ]),
  },
  {
    title: "Harga",
    key: "price",
    width: 120,
    render: (row) =>
      h(
        "div",
        { class: "text-sm font-medium text-gray-900 py-2" },
        ProductService.formatPrice(row.price)
      ),
  },
  {
    title: "Kategori",
    key: "category",
    width: 120,
    render: (row) =>
      h("div", { class: "text-sm text-gray-600 py-2" }, row.category.name),
  },
  {
    title: "Tanggal Diperbarui",
    key: "updated_at",
    width: 150,
    render: (row) =>
      h(
        "div",
        { class: "text-sm text-gray-600 py-2" },
        ProductService.formatDate(row.updated_at)
      ),
  },
  {
    title: "Tindakan",
    key: "actions",
    width: 100,
    render: (row) =>
      h("div", { class: "py-2" }, [
        h(NSwitch, {
          value: row.is_active === 1,
          size: "medium",
          onUpdateValue: (value: boolean) =>
            emit("toggle-status", row.id, value),
        }),
      ]),
  },
];

const paginationConfig = computed(() => ({
  page: props.currentPage,
  pageCount: props.totalPages,
  itemCount: props.totalItems,
  pageSize: props.perPage,
  showSizePicker: false,
  showQuickJumper: false,
  prefix: () => null,
  suffix: () => null,
  onUpdatePage: (page: number) => {
    emit("page-change", page);
  },
}));
</script>

<style scoped>
/* Custom pagination styling with Tailwind CSS */
:deep(.n-pagination) {
  @apply flex items-center gap-2 p-4 h-[32px] justify-end mb-2 bg-white w-full;
}

:deep(.n-pagination .n-pagination-item) {
  @apply min-w-[32px] h-7 flex items-center justify-center rounded-md border !border-gray-200 bg-white text-sm font-medium !text-main hover:bg-gray-50 hover:border-gray-300 transition-all duration-200;
}

:deep(.n-pagination .n-pagination-item--active) {
  @apply bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600;
}

:deep(.n-pagination .n-pagination-item--disabled) {
  @apply opacity-50 cursor-not-allowed hover:bg-white hover:border-gray-200;
}

:deep(.n-pagination .n-pagination-quick-jumper) {
  @apply hidden;
}

:deep(.n-pagination .n-pagination-sizes) {
  @apply hidden;
}

:deep(.n-pagination .n-pagination-prefix) {
  @apply hidden;
}

:deep(.n-pagination .n-pagination-suffix) {
  @apply hidden;
}

:deep(.n-pagination .n-pagination-prev),
:deep(.n-pagination .n-pagination-next) {
  @apply min-w-[32px] h-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all duration-200;
}

:deep(.n-pagination .n-pagination-prev--disabled),
:deep(.n-pagination .n-pagination-next--disabled) {
  @apply opacity-50 cursor-not-allowed hover:bg-white hover:border-gray-200 hover:text-gray-600;
}

:deep(.n-pagination .n-pagination-item--ellipsis) {
  @apply border-0 bg-transparent text-gray-400 hover:bg-transparent;
}

/* Data table styling with Tailwind CSS */
:deep(.n-data-table) {
  @apply rounded-lg overflow-hidden;
}

/* Header styling */
:deep(.n-data-table-th) {
  @apply bg-gray-50 !px-2 !text-gray-700 !text-xs font-semibold uppercase tracking-wide  py-2 border-0;
}

/* Table cell styling */
:deep(.n-data-table-td) {
  @apply bg-white text-gray-900 text-sm px-5 py-4 border-0;
}

/* Row hover effect */
:deep(.n-data-table-tr:hover .n-data-table-td) {
  @apply bg-gray-50;
}

/* Remove default borders */
:deep(.n-data-table-wrapper) {
  @apply border-0;
}

:deep(.n-data-table-base-table) {
  @apply border-0;
}
</style>
