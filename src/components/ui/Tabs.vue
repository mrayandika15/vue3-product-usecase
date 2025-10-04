<template>
  <div class="flex items-center">
    <div
      class="flex bg-gray-100 rounded-lg gap-1 p-1 border border-gray-200"
      style="width: 358px; height: 41px"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="handleTabClick(tab.value)"
        :class="[
          'flex-1 text-sm font-medium rounded-md transition-all duration-200',
          'px-[5px] py-1',
          activeTab === tab.value
            ? 'bg-white text-main shadow-sm border border-gray-300'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
        ]"
        style="border-radius: 8px"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Tab {
  label: string;
  value: string;
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
