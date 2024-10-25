<script setup lang="ts">
import { log } from "console";
import { openLink } from "~/utils/utils";
const route = useRoute();

const dragStore = useDragStore();
const { showChatDrag } = storeToRefs(dragStore);

const appStore = useAppStore();
const { custService, isApp } = storeToRefs(appStore);

toggleTheme("blue");

const openService = (url?: string) => {
  if (!url) return;
  openLink(url);
};

const r = 123;

console.log("App.vue文件 21行打印===============", r);

const handleUpdated = () => {
  const loading = document.querySelector("#full-loading");
  if (loading) {
    setTimeout(() => {
      loading.remove();
    }, 500);
  }
};

watch(route, (val) => {
  if (val.path === "/launch-game") {
    dragStore.setShowChatDrag(false);
  } else {
    dragStore.setShowChatDrag(true);
  }
});
</script>

<template>
  <div class="app-container">
    <RouterView @vue:updated="handleUpdated" />
    <AppLoginRegister />
    <AppFindPassword />
    <AppFooter />
    <AppEditAvatar />
    <AppGameItemPopup />
    <AppChatDrag
      iconName="/img/i-service-online.png"
      :ballY="60"
      @clike="() => openService(custService?.onlinecs)"
      v-if="!isApp && showChatDrag"
    />
  </div>
</template>
<style scoped>
.app-container {
  background: #0d1a36;
}
</style>
<style>
.van-toast {
  --van-toast-max-width: 75%;
}
</style>
