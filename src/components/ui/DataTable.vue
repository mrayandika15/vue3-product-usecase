<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Table Content -->
    <div class="overflow-x-auto">
      <n-data-table
        type="selection"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="paginationConfig"
        :row-key="rowKey"
        :bordered="false"
        :single-line="false"
        class="min-w-full custom-pagination"
      >
        <template #empty>
          <EmptyState
            :title="emptyTitle"
            :description="emptyDescription"
            :icon-src="emptyIcon"
            :show-action="showEmptyAction"
            :action-text="emptyActionText"
            @action="$emit('empty-action')"
          >
            <template #action>
              <slot name="empty-action" />
            </template>
          </EmptyState>
        </template>
      </n-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataTableColumns, NDataTable } from "naive-ui";
import { computed } from "vue";
import EmptyState from "./EmptyState.vue";

interface Props {
  title: string;
  columns: DataTableColumns;
  data: Array<Record<string, any>>;
  loading?: boolean;
  rowKey?: string | ((row: any) => string);
  pagination?: boolean | object;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  showEmptyAction?: boolean;
  emptyActionText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: "id",
  pagination: true,
  emptyTitle: "Barang masih kosong",
  emptyDescription: "Tambah barang untuk mulai berjualan",
  emptyIcon: "/box-add.png",
  showEmptyAction: false,
  emptyActionText: "Tambah Barang",
});

defineEmits<{
  "empty-action": [];
}>();

const paginationConfig = computed(() => {
  if (!props.pagination) return false;

  const baseConfig = {
    pageSize: 10,
    showSizePicker: false,
    showQuickJumper: false,
  };

  if (typeof props.pagination === "object") {
    return {
      ...baseConfig,
      ...props.pagination,
    };
  }

  return baseConfig;
});
</script>

<style scoped>
/* Custom pagination styling to match the design */
:deep(.n-pagination) {
  justify-content: end;
  width: 100%;
  padding: 16px;
  height: 56px;
  background: white;
  border-radius: 8px;
}

:deep(.n-pagination .n-pagination-item) {
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  margin: 0 2px;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

:deep(.n-pagination .n-pagination-item:hover) {
  border-color: #0b557f;
  color: #0b557f;
}

:deep(.n-pagination .n-pagination-item--active) {
  background-color: #0b557f;
  border-color: #0b557f;
  color: white;
}

:deep(.n-pagination .n-pagination-item--active:hover) {
  background-color: #0b557f;
  border-color: #0b557f;
  color: white;
}

:deep(.n-pagination .n-pagination-quick-jumper) {
  display: none;
}

:deep(.n-pagination .n-pagination-sizes) {
  display: none;
}

:deep(.n-pagination .n-pagination-prefix) {
  display: none;
}

:deep(.n-pagination .n-pagination-suffix) {
  display: none;
}

/* Navigation arrows styling */
:deep(.n-pagination .n-pagination-prev),
:deep(.n-pagination .n-pagination-next) {
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #6b7280;
}

:deep(.n-pagination .n-pagination-prev:hover),
:deep(.n-pagination .n-pagination-next:hover) {
  border-color: #0b557f;
  color: #0b557f;
}

:deep(.n-pagination .n-pagination-prev:disabled),
:deep(.n-pagination .n-pagination-next:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
