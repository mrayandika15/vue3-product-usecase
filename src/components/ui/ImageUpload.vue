<template>
  <div
    class="w-full flex items-center justify-between border border-gray-200 rounded-lg p-4"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-[#FAFAFA]"
      >
        <img
          v-if="previewUrl"
          :src="previewUrl"
          class="w-full h-full object-cover"
          alt="preview"
        />
        <img
          v-else
          src="/upload-photo-placeholder.png"
          alt="upload placeholder"
          class="w-16 h-16 object-contain opacity-70"
        />
      </div>
      <div class="space-y-1">
        <div class="text-sm font-medium">Unggah foto</div>
        <div class="text-xs text-gray-500">Format .png & .jpg up to 10MB</div>
        <div v-if="error" class="text-xs text-red-600">{{ error }}</div>
      </div>
    </div>
    <button
      type="button"
      class="px-4 py-2 rounded-md bg-sky-700 text-white hover:bg-sky-800"
      @click="pick"
    >
      Unggah Foto
    </button>
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: File | null;
    accept?: string;
    maxSize?: number;
  }>(),
  {
    accept: ".png,.jpg,.jpeg",
    maxSize: 10 * 1024 * 1024,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: File | null): void;
  (e: "change", value: File | null): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const error = ref<string | null>(null);

function cleanupPreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
}

function pick() {
  inputRef.value?.click();
}

function validate(file: File): string | null {
  if (file.size > props.maxSize) return "Ukuran file melebihi 10MB";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["png", "jpg", "jpeg"].includes(ext))
    return "Format harus .png atau .jpg";
  return null;
}

function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files && target.files[0] ? target.files[0] : null;
  error.value = null;
  cleanupPreview();
  if (file) {
    const err = validate(file);
    if (err) {
      error.value = err;
      emit("update:modelValue", null);
      emit("change", null);
      target.value = "";
      return;
    }
    previewUrl.value = URL.createObjectURL(file);
  }
  emit("update:modelValue", file);
  emit("change", file);
}

watch(
  () => props.modelValue,
  (file) => {
    cleanupPreview();
    if (file) previewUrl.value = URL.createObjectURL(file);
  }
);

onBeforeUnmount(() => {
  cleanupPreview();
});
</script>

<style scoped></style>
