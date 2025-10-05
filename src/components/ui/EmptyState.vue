<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <!-- Icon -->
    <div class="mb-6">
      <img :src="iconSrc" :alt="title" class="w-20 h-20 object-contain" />
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-700 mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-gray-500 text-center max-w-sm">
      {{ description }}
    </p>

    <!-- Action Button (optional) -->
    <div v-if="showAction" class="mt-6">
      <slot name="action">
        <button
          @click="$emit('action')"
          class="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors duration-200"
        >
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  iconSrc: string;
  showAction?: boolean;
  actionText?: string;
}

withDefaults(defineProps<Props>(), {
  showAction: false,
  actionText: "Add Item",
});

defineEmits<{
  action: [];
}>();
</script>

<style>
.n-data-table-empty {
  background-color: #fbfbfb;
}
</style>
