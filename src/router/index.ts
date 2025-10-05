import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import ProductCreateView from "@/views/ProductCreateView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "ProductList",
    component: () => import("@/views/ProductListView.vue"),
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
