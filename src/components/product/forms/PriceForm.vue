<template>
  <n-card class="space-y-4">
    <div class="text-base font-medium">Harga</div>
    <n-form-item label="Harga" path="price">
      <n-input
        :value="displayValue"
        placeholder="Rp 0"
        clearable
        @input="onInput"
        @blur="onBlur"
      />
    </n-form-item>
  </n-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { NFormItem, NInput, NCard } from "naive-ui";

const props = defineProps<{
  model: {
    price: number;
  };
}>();

const displayValue = ref<string>(formatIDR(props.model.price || 0));

function formatIDR(value: number): string {
  const n = Number.isFinite(value) ? value : 0;
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function parseIDR(input: string): number {
  const digits = input.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function onInput(val: string) {
  const parsed = parseIDR(val);
  props.model.price = parsed;
  displayValue.value = formatIDR(parsed);
}

function onBlur() {
  // ensure display is formatted on blur
  displayValue.value = formatIDR(props.model.price || 0);
}

watch(
  () => props.model.price,
  (price) => {
    displayValue.value = formatIDR(price || 0);
  }
);
</script>

<style scoped></style>
