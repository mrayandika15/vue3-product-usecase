import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./assets/main.css";
import App from "./App.vue";
import naive from "naive-ui";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(naive);
app.mount("#app");
