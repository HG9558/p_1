<script setup lang="ts" name="app-index-header-user-amount">
const appStore = useAppStore()
const { userInfo, loadingBalance, loadingUserinfo } = storeToRefs(appStore)

const loading = ref(false)

const refreshBalance = () => {
  loading.value = true
  appStore.runGetMemberInfo()
  setTimeout(() => {
    loading.value = false
  }, 1500);
}
</script>

<template>
  <div class="app-index-header-user-amount">
    <div class="left">
      <AppImage class="reload" :class="{ 'rotate': loading || loadingBalance || loadingUserinfo }"
        src="/icons/i-index-reload.png" alt="" @click="refreshBalance" />
      <span class="amount">{{ userInfo.formatAmount }}</span>
    </div>
    <div class="right">
      <AppButton class="btn" width="120" height="60" bold font-size="26" blue-to-bottom white-text
        @click="$router.push('/finance')">
        Conta
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-index-header-user-amount {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // width: 350px;
  height: 60px;
  border-radius: 100px;
  background: linear-gradient(180deg, rgba(46, 50, 69, 0.00) 0%, #011A51 100%);
  box-shadow: 0px 1px 4px 0px rgba(255, 255, 255, 0.30) inset, 0px 1px 0px 0px rgba(0, 0, 0, 0.10);
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  color: #fff;
  font-size: 26px;

  .rotate {
    animation: spin 1s linear infinite;
  }
}

.right .btn {
  border-radius: 0 60px 60px 0 !important;
}

.reload {
  width: 36px;
  height: 36px;
  vertical-align: middle;
  margin-right: 20px;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
