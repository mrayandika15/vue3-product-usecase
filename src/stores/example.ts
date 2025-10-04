import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const count = ref<number>(0)
  const name = ref<string>('Vue 3 App')

  // Getters
  const doubleCount = computed(() => count.value * 2)
  const greeting = computed(() => `Hello from ${name.value}!`)

  // Actions
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function updateName(newName: string) {
    name.value = newName
  }

  function reset() {
    count.value = 0
    name.value = 'Vue 3 App'
  }

  return {
    // State
    count,
    name,
    // Getters
    doubleCount,
    greeting,
    // Actions
    increment,
    decrement,
    updateName,
    reset
  }
})