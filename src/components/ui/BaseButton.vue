<template>
  <n-button
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :color="buttonColor"
    :text-color="textColor"
    :class="buttonClass"
    :round="round"
    :circle="circle"
    :ghost="ghost"
    :secondary="secondary"
    :tertiary="tertiary"
    :quaternary="quaternary"
    :strong="strong"
    :bordered="bordered"
    :dashed="dashed"
    :focusable="focusable"
    :keyboard="keyboard"
    :block="block"
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
  // Naive UI specific props
  color?: string;
  textColor?: string;
  round?: boolean;
  circle?: boolean;
  ghost?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  quaternary?: boolean;
  strong?: boolean;
  bordered?: boolean;
  dashed?: boolean;
  focusable?: boolean;
  keyboard?: boolean;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  size: "medium",
  loading: false,
  disabled: false,
  variant: "solid",
  round: false,
  circle: false,
  ghost: false,
  secondary: false,
  tertiary: false,
  quaternary: false,
  strong: false,
  bordered: true,
  dashed: false,
  focusable: true,
  keyboard: true,
  block: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonColor = computed(() => {
  if (props.color) return props.color;

  // Custom primary color using Naive UI color prop
  if (props.type === "primary") {
    return "#0b557f";
  }

  return undefined;
});

const textColor = computed(() => {
  if (props.textColor) return props.textColor;

  // Ensure white text for primary buttons
  if (props.type === "primary") {
    return "white";
  }

  return undefined;
});

const buttonClass = computed(() => {
  const classes = [];

  // Primary button styling using Tailwind
  if (props.type === "primary") {
    classes.push(
      "!w-[163px] !h-[35px] !rounded-lg !font-medium",
      "!px-[14px] !py-[10px]",
      "active:!bg-[#083f5f] active:!transform-none",
      "disabled:!bg-gray-500 disabled:!cursor-not-allowed"
    );
  } else if (props.variant === "outline") {
    classes.push("!border-2");
  } else if (props.variant === "ghost") {
    classes.push("!bg-transparent hover:!bg-gray-100");
  }

  return classes.join(" ");
});

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
}
</script>
