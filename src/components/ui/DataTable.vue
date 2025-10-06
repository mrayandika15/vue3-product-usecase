<template>
  <div
    class="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
  >
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="paginationConfig"
      :remote="true"
      :single-line="false"
      :bordered="false"
      :bottom-bordered="false"
      :striped="false"
      size="medium"
      :row-key="(row: Product) => row.id"
      :checked-row-keys="checkedRowKeys"
      @update:checked-row-keys="onUpdateCheckedRowKeys"
      :table-layout="'fixed'"
      :max-height="400"
      :min-height="400"
      :theme-overrides="dataTableThemeOverrides"
      :default-expand-all="false"
      :indent="24"
      children-key="children"
      :row-props="(rowData: Product) => ({
        'data-is-variant': rowData.isVariant || false
      } as any)"
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
import { formatDate, formatPrice } from "@/helpers/utils";
import type { Product } from "@/types/product";
import {
  ChevronDownOutline,
  ChevronUpOutline,
  ImageOutline,
} from "@vicons/ionicons5";
import type {
  DataTableColumns,
  DataTableProps,
  PaginationProps,
} from "naive-ui";
import { NDataTable, NIcon, NSwitch, NTag } from "naive-ui";
import { h, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import EmptyState from "./EmptyState.vue";

type DataTableThemeOverrides = NonNullable<DataTableProps["themeOverrides"]>;

// Minimal theme overrides - only for removing borders
const dataTableThemeOverrides: DataTableThemeOverrides = {
  borderColor: "transparent",
};

interface Props {
  data: Product[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  perPage?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  showEmptyAction?: boolean;
  emptyActionText?: string;
  loading?: boolean;
  // Controlled selection from parent (optional)
  checkedKeys?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  perPage: 10,
  checkedKeys: [] as number[],
});

const emit = defineEmits<{
  "page-change": [page: number];
  "empty-action": [];
  "row-select": [id: number, checked: boolean];
  "toggle-status": [id: number, status: boolean];
  "selection-change": [ids: number[]];
}>();

// Track expanded state for each row
const expandedRows = ref<Set<number>>(new Set());
// Track selection keys for checkbox selection
const checkedRowKeys = ref<number[]>([]);

// Router for navigation to edit page
const router = useRouter();

// Computed property to ensure reactivity

const columns: DataTableColumns<Product> = [
  {
    type: "selection",
    width: 50,
    disabled: (row: Product) => row.isVariant === true,
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
              "button",
              {
                type: "button",
                class: `font-medium text-main text-sm leading-5 hover:underline text-left ${
                  row.isVariant ? "text-gray-600 text-xs" : ""
                }`,
                onClick: (e: MouseEvent) => {
                  e.stopPropagation();
                  router.push({ name: "EditProduct", params: { id: row.id } });
                },
              },
              row.name
            ),
            h(
              "div",
              { class: "text-xs text-gray-500 leading-4" },
              row.category.name
            ),
          ]
        ),
        // Only show variant tags for parent products, not for variants themselves
        !row.isVariant && row.has_variant
          ? h("div", { class: "flex items-center gap-1 mt-1" }, [
              h(
                "div",
                {
                  class: "flex items-center cursor-pointer",
                  onClick: (e: Event) => {
                    e.stopPropagation();
                    // Toggle expanded state
                    const isExpanded = expandedRows.value.has(row.id);
                    if (isExpanded) {
                      expandedRows.value.delete(row.id);
                    } else {
                      expandedRows.value.add(row.id);
                    }
                    // Find the expand trigger and click it
                    const target = e.target as HTMLElement;
                    const expandTrigger = target
                      ?.closest("tr")
                      ?.querySelector(
                        ".n-data-table-expand-trigger"
                      ) as HTMLElement;
                    if (expandTrigger) {
                      expandTrigger.click();
                    }
                  },
                },
                [
                  h(
                    NTag,
                    {
                      size: "small",
                      type: "info",
                      bordered: false,
                      class:
                        "text-xs text-main bg-[#EFBB6D66]  rounded-md flex items-center gap-1 cursor-pointer",
                    },
                    {
                      default: () => [
                        `${row.has_variant} Varian`,
                        h(
                          NIcon,
                          {
                            size: 12,
                            class: "ml-1 transition-transform duration-200",
                          },
                          {
                            default: () =>
                              expandedRows.value.has(row.id)
                                ? h(ChevronUpOutline)
                                : h(ChevronDownOutline),
                          }
                        ),
                      ],
                    }
                  ),
                ]
              ),
              ...(row.as_addon
                ? [
                    h(
                      NTag,
                      {
                        size: "small",
                        type: "warning",
                        bordered: false,
                        class:
                          "text-xs !bg-[#DEEFFC66] !text-main rounded-md items-center gap-1",
                      },
                      { default: () => `${row.as_addon} Add On` }
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
        formatPrice(row.price)
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
        formatDate(row.updated_at)
      ),
  },
  {
    title: "Tindakan",
    key: "actions",
    width: 100,
    render: (row) => {
      // Hide actions for variant rows
      if (row.isVariant) {
        return h("div", { class: "py-2" }, "");
      }

      return h("div", { class: "py-2" }, [
        h(NSwitch, {
          value: row.is_active === 1,
          size: "medium",
          onUpdateValue: (value: boolean) =>
            emit("toggle-status", row.id, value),
        }),
      ]);
    },
  },
];

const paginationConfig: PaginationProps = reactive({
  page: props.currentPage,
  pageSize: props.perPage,
  pageCount: props.totalPages,
  itemCount: props.totalItems,
  showSizePicker: false,
  onUpdatePage: (page: number) => {
    emit("page-change", page);
  },
});

function onUpdateCheckedRowKeys(keys: Array<number | string>) {
  checkedRowKeys.value = keys.map((k) => Number(k));
  emit("selection-change", checkedRowKeys.value);
}

// Sync internal selection with parent-provided checkedKeys
watch(
  () => props.checkedKeys,
  (newVal) => {
    if (!Array.isArray(newVal)) return;
    const normalized = newVal.map((k) => Number(k));
    // Only update if different to avoid loops
    const changed =
      normalized.length !== checkedRowKeys.value.length ||
      normalized.some((v, i) => v !== checkedRowKeys.value[i]);
    if (changed) {
      checkedRowKeys.value = normalized;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Custom pagination styling with Tailwind CSS */
:deep(.n-pagination) {
  @apply flex items-center gap-2 p-4 h-[32px] justify-end mb-2  w-full;
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
  @apply rounded-lg overflow-hidden !py-0;
}

/* Header styling */
:deep(.n-data-table-th) {
  @apply bg-gray-50 !px-2 !text-gray-700 !text-xs font-semibold uppercase tracking-wide  py-4 border-0;
}

/* Table cell styling */
:deep(.n-data-table-td) {
  @apply bg-white text-gray-900 text-sm px-5 py-4 border-0;
}

/* Row hover effect */
:deep(.n-data-table-tr:hover .n-data-table-td) {
  @apply bg-gray-50;
}

/* Tree expand icon styling */
:deep(.n-data-table-expand-trigger) {
  @apply hidden;
}

/* Variant row styling - lighter background for child rows */
:deep(.n-data-table-tr[data-is-variant="true"] .n-data-table-td) {
  @apply bg-[#E9EBE8] border-l-2 border-l-blue-200;
}

:deep(.n-data-table-tr[data-is-variant="true"]:hover .n-data-table-td) {
  @apply bg-gray-100;
}

/* Tree indentation styling */
:deep(.n-data-table-td--tree-col) {
  @apply pl-6;
}

/* Custom tree line styling */
:deep(.n-data-table-td--tree-col::before) {
  @apply hidden;
}

/* Remove default borders */
:deep(.n-data-table-wrapper) {
  @apply border-0;
}

/* Hide checkbox for variant rows */
:deep(.n-data-table-tr[data-is-variant="true"] .n-checkbox) {
  @apply hidden;
}

:deep(.n-data-table-base-table) {
  @apply border-0;
}
</style>
