<script setup lang="ts" name="app-index-latest-win-item">

const props = withDefaults(defineProps<{
  data: {
    game_name: string
    uid: string
    amount: string
    game_id: string
    platform_id: string
  }
}>(), {})

const router = useRouter()

const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)

const { run: runLunch, loading } = useRequest(() => ApiLunchGame({ pid: props.data.platform_id + '', code: props.data.game_id }), {
  manual: true,
  onSuccess: (data) => {
    if (data && data.indexOf('http') !== -1) {
      router.push({ path: '/launch-game', query: { url: data } })
      // window.open(data)
    }
  }
})

const lunchGame = () => {
  if (loading.value) return
  if (isLogin.value) {
    runLunch()
  } else {
    appStore.setLoginDialogVisible(true)
  }
}
</script>

<template>
  <div class="app-index-latest-win-item" @click="lunchGame">
    <div class="left">
      <AppImage src="/icons/i-win.png" class="avatar" alt="" />
      <div class="info">
        <div class="name">{{ data.uid }}<slot></slot>
        </div>
        <div class="game">
          <div class="game-name">{{ data.game_name }}</div>
          <AppImage src="/icons/i-win-play.png" class="game-to" alt="" />
        </div>
      </div>
    </div>
    <div class="right">
      <AppImage class="right-icon" src="/icons/i-win-m.png" alt="" />
      <div class="amount">{{ UsAmountFormat(data.amount) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-index-latest-win-item {
  height: 110px;
  border-radius: 16px;
  background: rgba(0, 10, 29, 0.25);
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar {
      width: 55px;
      margin-right: 12px;
    }

    .info {
      .name {
        color: #FFF;
        font-size: 24px;
        margin-top: 7px;
      }

      .game {
        display: flex;
        align-items: center;
        margin-top: 2px;

        .game-name {
          color: #FDD82A;
          font-size: 26px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .game-to {
          width: 44px;
          vertical-align: middle;
        }
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 270px;
    height: 48px;
    color: #fff;
    font-size: 16px;
    line-height: 16px;
    border-radius: 24px;
    background: #17181B;
    padding: 0 16px;

    .right-icon {
      width: 36px;
    }

    .amount {
      color: #fff;
      font-size: 24px;
    }
  }
}
</style>
