<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
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
      :max-height="390"
      :table-layout="'fixed'"
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

// Define theme overrides for removing borders and custom pagination
const dataTableThemeOverrides: DataTableThemeOverrides = {
  borderColor: "transparent",
  paginationMargin: "24px 0 0 0",
  peers: {
    Pagination: {
      itemBorderRadius: "6px",
      itemTextColor: "#374151",
      itemTextColorHover: "#374151",
      itemTextColorPressed: "#1d4ed8",
      itemTextColorActive: "#ffffff",
      itemColorHover: "#f9fafb",
      itemColorPressed: "#eff6ff",
      itemColorActive: "#3b82f6",
      buttonColor: "#ffffff",
      buttonColorHover: "#f9fafb",
      buttonColorPressed: "#f3f4f6",
      buttonIconColor: "#6b7280",
      buttonIconColorHover: "#374151",
      buttonIconColorPressed: "#111827",
    },
  },
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
            row.has_variant
              ? h("div", { class: "flex items-center gap-1 mt-1" }, [
                  h(
                    NTag,
                    {
                      size: "small",
                      type: "info",
                      class: "text-xs",
                    },
                    { default: () => "3 Varian" }
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
          ]
        ),
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
/* Custom pagination styling using Tailwind CSS @apply directives */
:deep(.n-pagination) {
  @apply flex items-center  gap-2 w-full justify-end p-5 bg-white h-[36px];
}

:deep(.n-pagination .n-pagination-item) {
  @apply min-w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200;
}

:deep(.n-pagination .n-pagination-item--active) {
  @apply bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700;
}

:deep(.n-pagination .n-pagination-item--disabled) {
  @apply opacity-50 cursor-not-allowed hover:bg-white hover:border-gray-300;
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

/* Navigation buttons (prev/next) */
:deep(.n-pagination .n-pagination-item:first-child),
:deep(.n-pagination .n-pagination-item:last-child) {
  @apply px-3 font-medium;
}

/* Ellipsis styling */
:deep(
    .n-pagination .n-pagination-item--disabled:not(.n-pagination-item--active)
  ) {
  @apply border-transparent bg-transparent text-gray-400;
}
</style>
