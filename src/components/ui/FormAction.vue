<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 z-40">
    <div class="flex justify-between items-center">
      <!-- Delete (only for edit views) -->
      <div>
        <n-button
          v-if="showDelete"
          tertiary
          type="error"
          class="!bg-transparent !text-[#EC534A] !font-medium"
          @click="onDelete && onDelete()"
        >
          <n-icon size="16" class="mr-1">
            <TrashOutline />
          </n-icon>
          Hapus Barang
        </n-button>
      </div>

      <!-- Right actions -->
      <div class="flex justify-end gap-3">
        <n-button
          :bordered="false"
          text-color="#232323"
          class="!w-[163px] !h-[35px] !rounded-lg !font-medium !px-[14px] !py-[10px] !bg-[#F6F6F9] !hover:bg-[#ECECF1] !hover:text-[#232323]"
          @click="onCancel && onCancel()"
          >Batal</n-button
        >
        <BaseButton
          type="primary"
          :disabled="SubmitDisabled"
          @click="onSubmit && onSubmit()"
          >Simpan Barang</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from "naive-ui";
import { TrashOutline } from "@vicons/ionicons5";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps<{
  onSubmit?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  SubmitDisabled?: boolean;
  showDelete?: boolean;
}>();
</script>

<style scoped></style>
