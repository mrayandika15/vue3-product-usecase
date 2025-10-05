import { createPinia } from "pinia";
import { createApp } from "vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

// Create a client for Vue Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

app.use(pinia);
app.use(VueQueryPlugin, { queryClient });
app.use(router);
app.mount("#app");
