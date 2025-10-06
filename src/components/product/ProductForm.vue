<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="top">
    <div class="space-y-2">
      <InfoForm :model="model" />
      <PriceForm :model="model" />
      <DetailForm :model="model" />
      <AddOnsForm :model="model" />
    </div>
  </n-form>
  <FormAction
    :on-submit="handleSubmit"
    :on-cancel="() => emit('cancel')"
    :on-delete="() => emit('delete')"
    :showDelete="showDelete"
    :SubmitDisabled="isSubmitDisabled"
  />
</template>

<script setup lang="ts">
import InfoForm from "@/components/product/forms/InfoForm.vue";
import DetailForm from "@/components/product/forms/DetailForm.vue";
import PriceForm from "@/components/product/forms/PriceForm.vue";
import AddOnsForm from "@/components/product/forms/AddOnsForm.vue";
import { NForm, type FormInst, type FormRules } from "naive-ui";
import FormAction from "@/components/ui/FormAction.vue";
import { ref, computed } from "vue";
import type { ProductCreateFormModel } from "@/types/product";

const props = defineProps<{
  model: ProductCreateFormModel;
  showDelete?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", model: typeof props.model): void;
  (e: "cancel"): void;
  (e: "delete"): void;
}>();

const formRef = ref<FormInst | null>(null);

// Add-on options now live in AddOnsForm by default. Override via props if needed.

const rules: FormRules = {
  nama_barang: {
    required: true,
    message: "Nama Barang wajib diisi",
    trigger: ["input", "blur"],
  },
  kategori: {
    required: true,
    validator: (_rule, value: number | null) => {
      return (
        value !== null && typeof value === "number" && !Number.isNaN(value)
      );
    },
    message: "Kategori Barang wajib diisi",
    trigger: ["change", "blur", "input"],
  },
  sku: {
    required: true,
    message: "SKU wajib diisi",
    trigger: ["input", "blur"],
  },
  unit: {
    required: true,
    message: "Unit Barang wajib diisi",
    trigger: ["input", "blur"],
  },
  harga: {
    required: true,
    validator: (_rule, value: number) => {
      return typeof value === "number" && value > 0;
    },
    message: "Harga harus lebih dari 0",
    trigger: ["input", "blur"],
  },
};

// Disable submit when validation is incomplete
const isSubmitDisabled = computed(() => {
  const m = props.model;
  const hasNama =
    typeof m.nama_barang === "string" && m.nama_barang.trim().length > 0;
  const hasSku = typeof m.sku === "string" && m.sku.trim().length > 0;
  const hasUnit = typeof m.unit === "string" && m.unit.trim().length > 0;
  const validHarga = typeof m.harga === "number" && m.harga > 0;
  const k = m.kategori as unknown as number | string | null;
  const kNum = k === null ? NaN : typeof k === "number" ? k : Number(k);
  const validKategori = !Number.isNaN(kNum);
  return !(hasNama && hasSku && hasUnit && validHarga && validKategori);
});

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit("submit", props.model);
  } catch (_err) {
    // Validation errors are shown by Naive UI; no further action needed here
  }
};

// Add-on interactions are handled inside AddOnsForm; ProductForm only passes model
</script>

<style scoped></style>
