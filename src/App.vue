<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NH1 } from 'naive-ui'

const message = ref<string>('Vue 3 + TypeScript + Pinia + Naive UI + Tailwind CSS')
</script>

<template>
  <main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <NCard class="max-w-md w-full">
      <NH1 class="text-center mb-4">{{ message }}</NH1>
      <div class="text-center">
        <NButton type="primary" class="mr-2">
          Naive UI Button
        </NButton>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Tailwind Button
        </button>
      </div>
    </NCard>
  </main>
</template>

<style scoped></style>
