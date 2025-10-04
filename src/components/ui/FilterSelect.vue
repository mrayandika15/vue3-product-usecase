<template>
  <div class="relative flex gap-2 items-center justify-end">
    <label v-if="label" class="text-sm font-medium text-gray-700 mb-1 block">
      {{ label }}
    </label>
    <div class="relative w-fit">
      <select
        v-model="selectedValue"
        :disabled="disabled"
        :class="[
          'w-full h-[41px] px-3 pr-8 bg-white border border-gray-300 rounded-lg',
          'text-gray-900 text-sm appearance-none cursor-pointer',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          disabled ? 'text-gray-400' : 'text-gray-900',
        ]"
        @change="handleChange"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Custom dropdown arrow -->
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          class="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  modelValue: string | number | null;
  options: Option[];
  label?: string;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  filterable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option",
  size: "medium",
  disabled: false,
  loading: false,
  clearable: true,
  filterable: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  change: [value: string | number | null];
}>();

const selectedValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const value =
    target.value === ""
      ? null
      : isNaN(Number(target.value))
      ? target.value
      : Number(target.value);
  selectedValue.value = value;
  emit("update:modelValue", value);
  emit("change", value);
}
</script>
