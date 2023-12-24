<script setup lang="ts" name="app-login-register">
const appStore = useAppStore();
const {
  loginDialogVisible,
  loginDialogType
} = storeToRefs(appStore);
enum TabActive {
  login = 'login',
  register = 'register'
}
const tabData = ref([
  {
    label: 'Entrar',
    value: TabActive.login
  },
  {
    label: 'Cadastre-se',
    value: TabActive.register
  }
])
</script>

<template>
  <van-popup class="app-login-register" v-model:show="loginDialogVisible" teleport="body" round>
    <div class="content">
      <div class="title">
        <AppTab :list-data="tabData" v-model="loginDialogType" :height="84" active-color="#0ED1F4" />
      </div>
      <div v-show="loginDialogType === TabActive.login">
        <AppLogin />
      </div>
      <div v-show="loginDialogType === TabActive.register">
        <AppRegister />
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.content {
  width: 634px;
  border-radius: 20px;
  background: #011A51;

  .title {
    padding: 20px 0;
  }
}
</style>
