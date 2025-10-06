<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 z-40">
    <div class="flex justify-end gap-3">
      <n-button tertiary @click="onCancel && onCancel()">Batal</n-button>
      <n-button type="primary" @click="onSubmit && onSubmit()">Simpan Barang</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';

defineProps<{
  onSubmit?: () => void;
  onCancel?: () => void;
}>();
</script>

<style scoped></style>