<template>
  <div>
    <!-- Selected items bar -->
    <div v-if="selectedCount > 0" class="flex items-center gap-3 mb-3">
      <div class="text-sm text-gray-700">
        <span class="font-medium">{{ selectedCount }}</span> Produk dipilih
      </div>
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="underline text-[#5991F2] font-bold"
          @click="emit('bulk-deactivate')"
        >
          Nonaktifkan
        </button>
        <button
          type="button"
          class="underline text-[#5991F2] font-bold"
          @click="emit('bulk-activate')"
        >
          Aktifkan
        </button>
      </div>
    </div>
    <div class="flex items-center justify-between gap-4" v-else>
      <!-- Left side - Navigation tabs -->
      <div class="flex-1">
        <Tabs
          :model-value="activeTab"
          :tabs="tabOptions"
          @change="onTabChange"
        />
      </div>
      <!-- Right side - Search and filters -->
      <div class="flex items-center gap-2" style="width: 490px; height: 41px">
        <!-- Category Filter -->
        <div class="flex-1">
          <FilterSelect
            :model-value="pageCount"
            :options="options"
            label="Tampilkan"
            size="large"
            class="h-[41px]"
            @update:model-value="onPageCountChange"
          />
        </div>

        <!-- Search Input -->
        <div class="flex-1">
          <SearchInput
            :model-value="searchValue"
            placeholder="Cari barang"
            size="large"
            class="h-[41px]"
            @search="onSearchChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SearchInput from "@/components/ui/SearchInput.vue";
import FilterSelect from "@/components/ui/FilterSelect.vue";
import Tabs from "@/components/ui/Tabs.vue";

// Props interface
interface Props {
  activeTab: string;
  searchValue: string;
  pageCount: number;
  meta: {
    activeCount: number;
    inactiveCount: number;
    count: number;
  };
  selectedCount?: number;
}

// Emits interface
interface Emits {
  (e: "tab-change", value: string): void;
  (e: "search-change", value: string): void;
  (e: "page-count-change", value: number): void;
  (e: "bulk-activate"): void;
  (e: "bulk-deactivate"): void;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  activeTab: "all",
  searchValue: "",
  pageCount: 10,
  selectedCount: 0,
});

// Define emits
const emit = defineEmits<Emits>();
const meta = computed(() => props.meta);

// Tab options for the custom tabs component
const tabOptions = computed(() => [
  { label: "Semua Barang", value: "all", count: meta.value.count },
  { label: "Aktif", value: "1", count: meta.value.activeCount },
  { label: "Nonaktif", value: "0", count: meta.value.inactiveCount },
]);

// Tampilkan options for numerical filter
const options = computed(() => [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Event handlers - pure presentation layer
const onSearchChange = (value: string) => {
  emit("search-change", value);
};

const onTabChange = (tab: string) => {
  emit("tab-change", tab);
};

const onPageCountChange = (value: string | number | null) => {
  if (typeof value === "number") {
    emit("page-count-change", value);
  }
};
</script>
