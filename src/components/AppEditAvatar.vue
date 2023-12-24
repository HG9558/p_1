<script lang="ts" setup name="AppEditAvatar">
import { showFailToast } from 'vant';

const appStore = useAppStore();
const {
  editAvatarDialogVisble, userInfo
} = storeToRefs(appStore);

const avatar = ref(userInfo.value.avatar || 1)

const close = () => {
  appStore.setEditAvatarDialogVisble(false)
}

const itemClick = (a: any) => {
  avatar.value = a
}

const { loading, run } = useRequest(() => ApiUpdateAvatar({ avatar: +avatar.value}), {
  manual: true,
  onSuccess: (data) => {
    appStore.runGetMemberInfo()
    close()
  },
  onError: (err) => {
    showFailToast('Falha ao modificar o avatar')
  }
})
</script>

<template>
  <van-popup class="app-login-register" v-model:show="editAvatarDialogVisble" teleport="body" round>
    <div class="content">
      <h3>Modificar Avatar</h3>
      <ul>
        <li v-for="i in 12" :class="{ active: avatar === i }"
          :style="{ backgroundImage: 'url(/img/avatar/avatar' + i + '.png.webp)' }" @click="() => itemClick(i)"></li>
      </ul>
      <div class="btns">
        <div class="cancel" @click="close">Cancelar</div>
        <AppButton @click="run" :loading="loading" width="280" height="90" bold blue-to-right :radius="45" white-text>
          Confirme
        </AppButton>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.content {
  width: 634px;
  border-radius: 20px;
  background: #011A51;

  h3 {
    color: #FFF;
    text-align: center;
    font-size: 26px;
    font-weight: 400;
    padding-top: 48px;
    padding-bottom: 48px;
  }

  ul {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;

    li {
      width: 120px;
      height: 120px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      cursor: pointer;

      &.active {
        border: 5px solid #0ED1F4;
        border-radius: 120px;
      }
    }
  }

  .btns {
    padding-top: 48px;
    padding-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;

    .cancel {
      width: 280px;
      height: 90px;
      line-height: 90px;
      color: #FFF;
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      border-radius: 100px;
      background: #044B9A;
      cursor: pointer;
    }
  }
}

.avatar-img {
  width: 120px;
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
</style>
