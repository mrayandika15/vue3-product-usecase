<template>
  <n-card>
    <div>
      <!-- Info barang -->
      <div class="space-y-4">
        <div class="text-base font-medium">Info barang</div>
        <n-form-item label="Nama Barang" path="nama_barang">
          <n-input
            v-model:value="model.nama_barang"
            placeholder="Contoh: Ayam Goreng"
          />
        </n-form-item>

        <!-- Deskripsi as Accordion -->
        <div
          class="border-b pb-6 border-gray-200 flex justify-center items-center"
        >
          <n-collapse
            v-model:expanded-names="expandedNames"
            accordion
            arrow-placement="right"
          >
            <n-collapse-item name="description" :show-arrow="false">
              <template #header>
                <div class="flex items-center justify-between w-full">
                  <div>
                    <span class="text-sm font-medium">Deskripsi Barang</span>
                    <span class="text-xs text-gray-400"> (optional)</span>
                  </div>
                </div>
              </template>

              <n-form-item label="" path="deskripsi">
                <n-input
                  v-model:value="model.deskripsi"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  placeholder="Tuliskan deskripsi produk"
                />
              </n-form-item>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>

      <!-- Organisasi Barang -->
      <div class="space-y-4">
        <div class="text-base font-medium">Organisasi Barang</div>
        <n-form-item label="Kategori Barang" path="kategori">
          <n-select
            v-model:value="model.kategori"
            :options="categoryOptions"
            placeholder="Contoh: Makanan, Handphone"
          />
        </n-form-item>
      </div>

      <!-- Foto Barang -->
      <div class="space-y-4">
        <div class="text-base font-medium">Foto Barang</div>
        <ImageUpload v-model="model.file" />
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import {
  NFormItem,
  NInput,
  NCollapse,
  NCollapseItem,
  NSelect,
  NCard,
} from "naive-ui";

import type { ProductCreateFormModel } from "@/types/product";

const props = defineProps<{
  model: Pick<
    ProductCreateFormModel,
    "nama_barang" | "deskripsi" | "kategori" | "file"
  >;
}>();

const expandedNames = ref<string[]>([]);

const categoryOptions = [
  { label: "Makanan", value: 1 },
  { label: "Handphone", value: 2 },
  { label: "Minuman", value: 3 },
  { label: "Lainnya", value: 4 },
];
</script>

<style scoped>
/* Remove Naive UI default collapse paddings and borders in this section */
:deep(.n-collapse) {
  border: none;
}
:deep(.n-collapse-item) {
  border: none;
}
:deep(.n-collapse-item__header) {
  padding: 0;
  min-height: auto;
}
:deep(.n-collapse-item__content) {
  padding: 0;
}
</style>
