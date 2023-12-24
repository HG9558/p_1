<script setup lang="ts" name="app-notice">
const { data } = useRequest(ApiGetMemerNotice, {
  onSuccess(res) {
    if (res) {
      res.forEach((item) => {
        item.content = decodeURIComponent(decodeURIComponent(item.content))
      })
    }
  }
})

const show = ref(false)
const noticeSwipeRef = ref()
const showNoticeDialog = (i: number) => {
  show.value = true
  noticeSwipeRef.value?.swipeTo(i)
}
</script>

<template>
  <div class="app-notice">
    <van-notice-bar color="var(--notice-color)" background="var(--notice-bg)">
      <template #default>
        <span class="notice-text" v-for="t, i in data" :key="t.id" @click="showNoticeDialog(i)">{{ t.content }}</span>
      </template>
      <template #left-icon>
        <AppImage class="lefticon" src="/icons/i-notice.png" alt="" />
      </template>
    </van-notice-bar>
  </div>

  <van-popup v-model:show="show">
    <div class="notice-dialog">
      <van-swipe ref="noticeSwipeRef" class="my-swipe" :autoplay="0" indicator-color="white">
        <van-swipe-item v-for="item in data" :key="item.id">
          <div class="swipe-item">
            <div class="title">{{ item.title }}</div>
            <p class="content">
              {{ item.content }}
            </p>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.app-notice {
  height: 60px;
  --notice-color: #fff;
  --notice-bg: #011A51;

  :deep(.van-notice-bar) {
    height: 100%;
    padding: 0 20px;
    border-radius: 30px;
    font-size: 22px;
  }

  .lefticon {
    width: 36px;
    margin-right: 15px;
  }

  .notice-text {
    margin-right: 60px;
  }
}

.notice-dialog {
  width: 634px;
  height: 600px;
  border-radius: 20px;
  background: linear-gradient(0deg, #011A51 0%, #011A51 100%), #1F2332;

  .swipe-item {
    width: 100%;
    height: 560px;
    padding: 48px;
    padding-bottom: 0;
    color: #fff;
    font-size: 26px;

    .title {
      font-weight: 700;
      text-align: center;
      margin-bottom: 76px;
    }

    .content {
      width: 100%;
      height: 360px;
      overflow-y: auto;
    }
  }
}
</style>
