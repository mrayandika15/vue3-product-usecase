<template>
  <header
    :class="[
      'sticky top-0 z-30 w-screen',
      isScrolled
        ? 'bg-white w-full fixed top-0 left-0 shadow-sm'
        : 'bg-transparent',
      'px-6 py-4',
    ]"
  >
    <div class="flex items-center gap-2">
      <router-link
        v-if="to"
        :to="to"
        class="text-gray-500 hover:text-gray-700 flex items-center gap-2"
      >
        <span aria-hidden="true">←</span>
        <span class="text-lg font-semibold">{{ title }}</span>
      </router-link>
      <div v-else class="flex items-center gap-2">
        <span class="text-lg font-semibold">{{ title }}</span>
      </div>

      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineProps<{ title: string; to?: string }>();

const isScrolled = ref(false);
const onScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped></style>
