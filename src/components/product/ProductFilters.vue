<template>
  <div class="py-4">
    <div class="flex items-center justify-between gap-4">
      <!-- Left side - Navigation tabs -->
      <div class="flex-1">
        <Tabs
          v-model="activeTab"
          :tabs="tabOptions"
          @change="handleTabChange"
        />
      </div>
      <!-- Right side - Search and filters -->
      <div class="flex items-center gap-2" style="width: 490px; height: 41px">
        <!-- Category Filter -->
        <div class="flex-1">
          <FilterSelect
            v-model="localFilters.tampilkan"
            :options="tampilkanOptions"
            label="Tampilkan"
            size="large"
            class="h-[41px]"
          />
        </div>

        <!-- Search Input -->
        <div class="flex-1">
          <SearchInput
            v-model="localFilters.search"
            placeholder="Cari barang"
            size="large"
            class="h-[41px]"
            @search="handleSearchChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useProductStore } from "@/stores/productStore";
import SearchInput from "@/components/ui/SearchInput.vue";
import FilterSelect from "@/components/ui/FilterSelect.vue";
import Tabs from "@/components/ui/Tabs.vue";

const productStore = useProductStore();

// Local reactive state
const localFilters = ref({
  search: productStore.filters.search,
  tampilkan: 10, // Default numerical value
});

// Active tab state
const activeTab = ref("semua-barang");

// Tab options for the custom tabs component
const tabOptions = computed(() => [
  { label: "Semua Barang", value: "semua-barang" },
  { label: "Aktif", value: "aktif" },
  { label: "Nonaktif", value: "nonaktif" },
]);

// Tampilkan options for numerical filter
const tampilkanOptions = computed(() => [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Category options for filter (keeping for reference, but not used anymore)
const categoryOptions = computed(() => [
  { label: "Semua Kategori", value: "" },
  ...productStore.categories.map((category) => ({
    label: category,
    value: category,
  })),
]);

// Watch for changes and update store
watch(
  localFilters,
  (newFilters) => {
    // Update store with new filters structure
    productStore.updateFilters({
      search: newFilters.search,
      tampilkan: newFilters.tampilkan,
    });
  },
  { deep: true }
);

// Event handlers
const handleSearchChange = (value: string) => {
  localFilters.value.search = value;
};

const handleTabChange = (tab: string) => {
  activeTab.value = tab;
  // Here you can add logic to filter by status if needed
};
</script>
