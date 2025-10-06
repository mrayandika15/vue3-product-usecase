<template>
  <n-card class="space-y-2">
    <div class="text-base font-medium">Detail Barang</div>
    <div class="text-xs text-gray-500">
      Pilih tipe barang yang sesuai dengan barang Anda
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <n-form-item label="Kode Barang (SKU)" path="sku">
        <n-input v-model:value="model.sku" placeholder="Contoh: AG001" />
      </n-form-item>

      <n-form-item label="Unit Barang" path="unit">
        <n-input
          v-model:value="model.unit"
          placeholder="Contoh: kg, pcs, unit"
        />
      </n-form-item>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NFormItem, NInput, NCard } from "naive-ui";
import type { ProductCreateFormModel } from "@/types/product";

defineProps<{
  model: Pick<ProductCreateFormModel, "sku" | "unit">;
}>();
</script>

<style scoped></style>
