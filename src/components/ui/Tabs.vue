<template>
  <div class="flex items-center">
    <div class="flex bg-gray-100 rounded-lg gap-1 p-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="handleTabClick(tab.value)"
        :class="[
          'flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
          'min-w-0 flex-shrink-0',
          activeTab === tab.value
            ? ' bg-white text-main shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
        ]"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.count !== undefined"
          :class="[
            'px-2 py-0.5 text-xs rounded-md border-gray-400 text-main border font-medium',
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Tab {
  label: string;
  value: string;
  count?: number;
}

interface Props {
  tabs: Tab[];
  modelValue?: string;
  defaultTab?: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  defaultTab: "",
});

const emit = defineEmits<Emits>();

// Initialize active tab
const activeTab = ref(
  props.modelValue ||
    props.defaultTab ||
    (props.tabs.length > 0 ? props.tabs[0].value : "")
);

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== activeTab.value) {
      activeTab.value = newValue;
    }
  }
);

// Handle tab click
const handleTabClick = (value: string) => {
  activeTab.value = value;
  emit("update:modelValue", value);
  emit("change", value);
};
</script>
