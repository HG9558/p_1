<template>
  <div class="app-banner">
    <template v-if="banners.length < 1">
      <div class="img ad-img default_banner"></div>
    </template>
    <template v-else>
      <van-swipe>
        <van-swipe-item v-for="(item, index) in banners" :key="index">
          <RouterLink :to="item.redirect_url" class="link">
            <div
              class="img ad-img"
              :style="{
                backgroundImage: isFullPath(item.h5img || '')
                  ? item.h5img
                  : `url(${brazilImg + item.h5img})`,
              }"
            ></div>
          </RouterLink>
        </van-swipe-item>
        <!-- 指示器 -->
        <template v-if="banners && banners.length > 1" #indicator="{ active }">
          <div class="custom-content">
            <span
              v-for="(item, i) in banners"
              :key="i + item.h5img"
              :class="{
                active: active === i,
              }"
              class="custom-indicator"
            >
            </span>
          </div>
        </template>
      </van-swipe>
    </template>
  </div>
</template>

<script setup lang="ts" name="app-banner">
interface BannerObj {
  src: string;
}

interface Props {
  listData: BannerObj[];
}

withDefaults(defineProps<Props>(), {});

const { data: list } = useRequest(ApiGetMemerBanner);

const banners = computed(() => {
  if (list.value && list.value.length) {
    return list.value
      .filter((item) => {
        return item.title != "reward-box";
      })
      .map((i) => {
        let images = i.images.split("&");
        let h5str = images.filter((m: any) => m.indexOf("h5=") != -1)[0];
        i.redirect_url = decodeURIComponent(decodeURIComponent(i.redirect_url));
        if (h5str) {
          i.h5img = h5str.split("=")[1];
        }
        return i;
      });
  }
  return [];
});
</script>

<style lang="scss" scoped>
.app-banner {
  width: 100%;
  height: 280px;

  .custom-content {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;

    .custom-indicator {
      width: 16px;
      height: 16px;
      background: #cccccc80;
      transition: all 0.3s;
      border-radius: 100px;
      margin: 0 4px;

      &.active {
        width: 46px;
        background: #cccccc;
      }
    }
  }

  .default_banner {
    background-image: url("/img/default_banner.webp");
    background-size: 100% 100%;
    height: 100%;
  }

  .link {
    display: block;
    width: 100%;
    height: 280px;

    .img {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
}
</style>
