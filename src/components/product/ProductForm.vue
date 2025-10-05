<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="top">
    <div class="space-y-6">
      <InfoForm :model="model" />
      <PriceForm :model="model" />
      <DetailForm :model="model" />
      <AddOnsForm :model="model" />

      <!-- Actions -->
      <div class="pt-2 flex justify-end gap-3">
        <n-button tertiary @click="emit('cancel')">Batal</n-button>
        <n-button type="primary" @click="handleSubmit">Simpan Barang</n-button>
      </div>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import InfoForm from "@/components/product/forms/InfoForm.vue";
import DetailForm from "@/components/product/forms/DetailForm.vue";
import PriceForm from "@/components/product/forms/PriceForm.vue";
import AddOnsForm from "@/components/product/forms/AddOnsForm.vue";
import { NButton, NForm, type FormInst, type FormRules } from "naive-ui";
import { ref } from "vue";

const props = defineProps<{
  model: {
    name: string;
    description: string;
    category: string | null;
    file: File | null;
    price: number;
    sku: string;
    unit: string;
    addOnsSelected: { label: string; value: string; status: boolean }[];
  };
}>();

const emit = defineEmits<{
  (e: "submit", model: typeof props.model): void;
  (e: "cancel"): void;
}>();

const formRef = ref<FormInst | null>(null);

// Add-on options now live in AddOnsForm by default. Override via props if needed.

const rules: FormRules = {
  name: {
    required: true,
    message: "Nama Barang wajib diisi",
    trigger: ["input", "blur"],
  },
  category: {
    required: true,
    message: "Kategori Barang wajib diisi",
    trigger: ["change", "blur"],
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
  price: {
    required: true,
    validator: (_rule, value: number) => {
      return typeof value === "number" && value > 0;
    },
    message: "Harga harus lebih dari 0",
    trigger: ["input", "blur"],
  },
};

const handleSubmit = async () => {
  const errors = await formRef.value?.validate();
  if (!errors) emit("submit", props.model);
};

// Add-on interactions are handled inside AddOnsForm; ProductForm only passes model
</script>

<style scoped></style>
