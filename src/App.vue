<template>
  <div id="app" class="min-h-screen">
    <n-config-provider v-if="route.meta.useNaive">
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <router-view />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
} from "naive-ui";

const route = useRoute();
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
