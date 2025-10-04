<template>
  <div class="relative">
    <n-input
      v-model:value="inputValue"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      clearable
      @input="handleInput"
      @clear="handleClear"
      @keyup.enter="handleEnter"
      class="pr-10"
    >
      <template #prefix>
        <n-icon :component="SearchIcon" class="text-main" />
      </template>
    </n-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { NInput, NIcon } from "naive-ui";
import { SearchOutline as SearchIcon } from "@vicons/ionicons5";

interface Props {
  modelValue: string;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  debounce?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search...",
  size: "medium",
  disabled: false,
  loading: false,
  debounce: 300,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  search: [value: string];
  clear: [];
  enter: [value: string];
}>();

const inputValue = ref(props.modelValue);
let debounceTimer: NodeJS.Timeout | null = null;

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

function handleInput(value: string) {
  inputValue.value = value;
  emit("update:modelValue", value);

  // Debounced search
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    emit("search", value);
  }, props.debounce);
}

function handleClear() {
  inputValue.value = "";
  emit("update:modelValue", "");
  emit("clear");
  emit("search", "");
}

function handleEnter() {
  emit("enter", inputValue.value);
  emit("search", inputValue.value);
}
</script>
