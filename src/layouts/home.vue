<script setup lang="ts" name="home">

</script>

<template>
  <div class="app-index">
    <AppIndexHeader />
    <AppBanner :list-data="[
      {
        src: 'https://dl-up.td22t5f.com/1680214025494932.png.webp'
      }, {
        src: 'https://dl-up.td22t5f.com/1680214103509582.png.webp'
      }, {
        src: 'https://dl-up.td22t5f.com/1680215411600671.png.webp'
      }
    ]" />
    <div class="app-index-container">
      <!-- <AppNotice /> -->
      <div class="haha">
        <AppPromoBox />
        <AppGameTab />
      </div>
      <!-- <AppGameSearch /> -->
      <KeepAlive>
        <RouterView />
      </KeepAlive>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.haha {
  background: #122039;
  margin-left: -20px;
  margin-right: -20px;
  padding: 0 20px;
  padding-bottom: 20px;
  margin-top: -20px;
  padding-top: 20px;
}
.app-index {
  padding-top: 110px;
}

.app-index-container {
  padding: 20px 20px 140px 20px;
}
</style>
