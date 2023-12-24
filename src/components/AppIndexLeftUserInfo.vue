<script setup lang="ts" name="app-index-left-user-info-header">
const appStore = useAppStore()
const { userInfo, loadingBalance, loadingUserinfo } = storeToRefs(appStore)
// const uid = computed(() => {
//   if (userInfo.value?.uid) {
//     return userInfo.value?.uid.toString().length > 6 ? userInfo.value?.uid.toString().slice(0, 6) + '...' : userInfo.value?.uid
//   }
// })
// const copyName = () => {
//   copy(userInfo.value?.uid)
//   showToast('Copied!')
// }

const openAvatar = () => {
  appStore.setEditAvatarDialogVisble(true)
}


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
  <!-- <div class="app-index-left-user-info-header">
    <div class="avatar">
      <AppImage class="img" :src="'/img/avatar/avatar' + userInfo.avatar + '.png'" alt="" @click="openAvatar" />
    </div>
    <div class="user-name">
      <div class="right-c" @click="copyName">
        {{ uid }}
        <AppImage class="copy" src="/icons/i-copy.png" alt="" />
      </div>
    </div>
    <div class="vip-container">
      <AppImgVip :vip-level="0" width="132" />
    </div>
  </div> -->
  <div class="nav-user-info">
    <div class="avatar">
      <AppImage class="img" :src="'/img/avatar/avatar' + userInfo.avatar + '.png'" alt="" @click="openAvatar" />
    </div>
    <div class="right">
      <div class="money">
        <AppImage class="reload" :class="{ 'rotate': loading || loadingBalance || loadingUserinfo }"
          src="/icons/i-money-reload.png" alt="" @click="refreshBalance" />
        <span class="amount">{{ userInfo.formatAmount }}</span>
      </div>
      <div class="vip-container">
        <AppImgVip :vip-level="userInfo.vip" width="60" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-user-info {
  position: relative;
  width: 476px;
  height: 96px;
  border-radius: 10px;
  background: linear-gradient(90deg, #0034A6 0%, #0034A6 100%);
  margin-left: 32px;
  // display: flex;
  // align-items: center;
  // gap: 20px;
  // justify-content: center;
  :deep(.app-img-vip) {
    height: auto;
    img {
      display: block;
    }
  }
  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 100px;
    border: 4px solid #0ED1F4;
    position: absolute;
    top: -13px;
    left: 26px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    height: 100%;
    padding-right: 22px;
  }
  .money {
    height: 46px;
    border-radius: 50px;
    background: rgba(16,28,50,0.7);
    color: #FFF;
    font-size: 26px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 8px;
    padding-right: 16px;
    min-width: 238px;
    img {
      width: 32px;
      margin-right: 6px;
    }
  }
}
.app-index-left-user-info-header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;

  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 4px solid #0ED1F4;
    overflow: hidden;

    .img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
    }
  }

  .user-name {
    display: flex;
    color: #fff;
    align-items: center;
    justify-content: center;
    padding: 24px 0;

    .left-c {
      color: #FFF;
      font-size: 28px;
      font-weight: 700;
      margin-right: 13px;
    }

    .right-c {
      height: 46px;
      border-radius: 50px;
      background: rgba(0, 0, 0, 0.25);
      color: #FFF;
      font-size: 26px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 17px;

      .copy {
        width: 25px;
        vertical-align: middle;
        margin-left: 11px;
      }
    }


  }

  .vip-container {
    position: absolute;
    left: 21px;
    top: -60px;
  }
}


.reload {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  // margin-right: 20px;
  &.rotate {
    animation: spin 1s linear infinite;
  }
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
