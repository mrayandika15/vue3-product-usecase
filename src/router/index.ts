import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import ProductCreateView from "@/views/ProductCreateView.vue";
import ProductListView from "@/views/ProductListView.vue";
import EditProduct from "@/views/ProductEditView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "ProductList",
    component: ProductListView,
    meta: { useNaive: true },
  },
  {
    path: "/edit/:id",
    name: "EditProduct",
    component: EditProduct,
    meta: { useNaive: true },
  },
  {
    path: "/add",
    name: "AddProduct",
    component: ProductCreateView,
    meta: { useNaive: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
