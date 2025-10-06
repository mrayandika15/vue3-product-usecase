<template>
  <div class="pb-12">
    <n-card>
      <div class="space-y-2">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-base font-medium">Add On</div>
            <div class="text-xs text-gray-500">
              Tambahkan Add On pada barang Anda
            </div>
          </div>
          <div class="text-xs text-gray-500">
            Limit Penambahan Add On
            <span class="text-[#5991F2] font-semibold">
              ({{ countAddOns }}/{{ MAX_ADDONS }})
            </span>
          </div>
        </div>

        <n-form-item label="Pilih Add On" path="addOn">
          <div class="flex w-full items-center gap-3">
            <n-select
              v-model:value="selectedValue"
              :options="options"
              :loading="addOnStore.isLoading"
              placeholder="-- Pilih Add On --"
              class="flex-1 focus:!outline-none"
              clearable
              :disabled="countAddOns >= MAX_ADDONS"
            />
            <BaseButton
              custom-class="!w-[100px]"
              type="primary"
              @click="onAdd"
              :disabled="countAddOns >= MAX_ADDONS"
            >
              + Tambah
            </BaseButton>
          </div>
        </n-form-item>

        <!-- Table of selected add-ons -->
        <div class="mt-4" v-if="hasTableData">
          <n-data-table
            :columns="columns"
            :data="tableData"
            :bordered="false"
            :bottom-bordered="false"
            :single-line="false"
            size="medium"
            :row-key="rowKey"
          />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { TrashOutline } from "@vicons/ionicons5";
import {
  NButton,
  NCard,
  NDataTable,
  NFormItem,
  NIcon,
  NSwitch,
  NSelect,
  useMessage,
} from "naive-ui";
import { computed, h, ref, onMounted } from "vue";
import type { ProductCreateFormModel, AddOnItem } from "@/types/product";
import { useAddOnStore } from "@/stores/addOnStore";
import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps<{
  model: Pick<ProductCreateFormModel, "add_on" | "has_addon">;
}>();

const selectedValue = ref<number | null>(null);
const MAX_ADDONS = 5;
const message = useMessage();

// Store-backed options
const addOnStore = useAddOnStore();

onMounted(() => {
  addOnStore.initialFetchAddOns();
});

const options = computed(() =>
  (addOnStore.addOns ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }))
);
const optionMap = computed<Record<number, string>>(() => {
  return Object.fromEntries(options.value.map((o) => [o.value, o.label]));
});

function onAdd() {
  if (countAddOns.value >= MAX_ADDONS) {
    message.warning(`Batas maksimal ${MAX_ADDONS} Add On tercapai.`);
    return;
  }
  if (selectedValue.value == null) return;
  if (!props.model.add_on) props.model.add_on = [];
  const exists = props.model.add_on.some(
    (item) => item.id === selectedValue.value
  );
  if (!exists) {
    // reassign to ensure reactivity in some edge cases
    props.model.add_on = [
      ...props.model.add_on,
      { id: selectedValue.value, is_active: true },
    ];
    props.model.has_addon = true;
  }
  selectedValue.value = null;
}

const tableData = computed<AddOnItem[]>(() => props.model.add_on ?? []);
const hasTableData = computed<boolean>(
  () => (props.model.add_on ?? []).length > 0
);

const countAddOns = computed<number>(() => (props.model.add_on ?? []).length);

// Provide row key as a function to satisfy NDataTable prop type
const rowKey = (row: AddOnItem) => row.id as number;

const columns = [
  {
    title: "Add On",
    key: "id",
    render: (row: { id: number | null }) =>
      h(
        "div",
        { class: "py-2" },
        row.id != null ? optionMap.value[row.id] ?? `AddOn #${row.id}` : "-"
      ),
  },
  {
    title: "Status",
    key: "is_active",
    width: 120,
    render: (row: { id: number | null; is_active: boolean | null }) =>
      h(NSwitch, {
        value: !!row.is_active,
        size: "medium",
        onUpdateValue: (val: boolean) => {
          const target = (props.model.add_on ?? []).find(
            (i) => i.id === row.id
          );
          if (target) target.is_active = val;
        },
      }),
  },
  {
    title: "Tindakan",
    key: "actions",
    width: 90,
    render: (row: { id: number | null }) =>
      h(
        NButton,
        {
          tertiary: true,
          type: "error",
          size: "small",
          class: "bg-transparent",
          onClick: () => {
            const list = props.model.add_on ?? [];
            const idx = list.findIndex((i) => i.id === row.id);
            if (idx !== -1) list.splice(idx, 1);
            props.model.has_addon = (props.model.add_on ?? []).length > 0;
          },
        },
        {
          default: () => [
            h(NIcon, { size: 16 }, { default: () => h(TrashOutline) }),
          ],
        }
      ),
  },
];
</script>

<style scoped></style>
