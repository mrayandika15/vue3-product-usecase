<template>
  <n-button
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :class="buttonClass"
    @click="handleClick"
  >
    <template #icon v-if="icon">
      <component :is="icon" />
    </template>
    <slot />
  </n-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton } from "naive-ui";
import type { Component } from "vue";

interface Props {
  type?: "default" | "primary" | "info" | "success" | "warning" | "error";
  size?: "tiny" | "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: Component;
  variant?: "solid" | "outline" | "ghost";
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  size: "medium",
  loading: false,
  disabled: false,
  variant: "solid",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => {
  const classes = [];

  // Custom primary button styling with Figma specifications
  if (props.type === "primary") {
    classes.push("custom-primary-button");
  } else if (props.variant === "outline") {
    classes.push("border-2");
  } else if (props.variant === "ghost") {
    classes.push("bg-transparent hover:bg-gray-100");
  }

  return classes.join(" ");
});

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
}
</script>

<style scoped>
.custom-primary-button {
  background-color: #0b557f !important;
  width: 163px;
  height: 41px;
  gap: 6px;
  opacity: 1;
  padding: 10px 16px 10px 14px;
  border-radius: 8px;
  border: none;
  color: white;
  font-weight: 500;
}

.custom-primary-button:active {
  background-color: #083f5f !important;
  transform: translateY(0);
}

.custom-primary-button:disabled {
  background-color: #6b7280 !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
