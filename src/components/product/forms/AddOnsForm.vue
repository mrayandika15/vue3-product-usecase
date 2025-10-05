<template>
  <n-card>
    <div class="space-y-2">
      <div class="text-base font-medium">Add On</div>
      <div class="text-xs text-gray-500">Tambahkan Add On pada barang Anda</div>

      <n-form-item label="Pilih Add On" path="addOn">
        <div class="flex w-full items-center gap-3">
          <n-select
            v-model:value="selectedValue"
            :options="options"
            placeholder="-- Pilih Add On --"
            class="flex-1"
            clearable
          />
          <n-button type="primary" ghost @click="onAdd"> + Tambah </n-button>
        </div>
      </n-form-item>

      <!-- Table of selected add-ons -->
      <div class="mt-4" v-if="tableData.length">
        <n-data-table
          :columns="columns"
          :data="tableData"
          :bordered="false"
          :bottom-bordered="false"
          :single-line="false"
          size="medium"
          :row-key="(row) => row.value"
        />
      </div>
    </div>
  </n-card>
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
} from "naive-ui";
import { computed, h, ref } from "vue";

const props = defineProps<{
  model: {
    addOnsSelected: { label: string; value: string; status: boolean }[];
  };
}>();

const selectedValue = ref(null);

const options = [
  { label: "Garansi", value: "warranty" },
  { label: "Asuransi", value: "insurance" },
  { label: "Bungkus Kado", value: "giftwrap" },
];

function onAdd() {
  if (!selectedValue.value) return;
  const exists = props.model.addOnsSelected.some(
    (item) => item.value === selectedValue.value
  );
  if (!exists) {
    const opt = options.find((o) => o.value === selectedValue.value)!;
    props.model.addOnsSelected.push({
      label: opt.label,
      value: opt.value,
      status: true,
    });
  }
  selectedValue.value = null;
}

const tableData = computed(() => props.model.addOnsSelected);

const columns = [
  {
    title: "Add On",
    key: "label",
    render: (row: { label: string }) => h("div", { class: "py-2" }, row.label),
  },
  {
    title: "Status",
    key: "status",
    width: 120,
    render: (row: { value: string; status: boolean }) =>
      h(NSwitch, {
        value: row.status,
        size: "medium",
        onUpdateValue: (val: boolean) => {
          const target = props.model.addOnsSelected.find(
            (i) => i.value === row.value
          );
          if (target) target.status = val;
        },
      }),
  },
  {
    title: "Tindakan",
    key: "actions",
    width: 90,
    render: (row: { value: string }) =>
      h(
        NButton,
        {
          tertiary: true,
          type: "error",
          size: "small",
          class: "bg-transparent",
          onClick: () => {
            const idx = props.model.addOnsSelected.findIndex(
              (i) => i.value === row.value
            );
            if (idx !== -1) props.model.addOnsSelected.splice(idx, 1);
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
