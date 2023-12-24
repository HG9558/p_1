<script setup lang='ts' name='invite'>
import InvitePage from './components/invite-page.vue';
import InviteDaily from './components/invite-daily.vue';
import InviteData from './components/invite-data.vue';

const { isApp } = storeToRefs(useAppStore())
const currentType = ref('1')
const typeList = [
  { label: 'Como<br/>convidar', value: '1' },
  { label: 'Convite<br/>diariamente', value: '2' },
  { label: 'Dados do<br/>convite', value: '3' },
]
</script>
<template>
  <div class="invite">
    <AppHeader title="Bónus de Convite" left-arrow placeholder />
    <div class="tab-bg" :style="{ top: isApp ? 0 : '' }">
      <div class="tab">
        <AppTab :listData="typeList" :height="100" v-model="currentType" v-slot="{ item }">
          <div class="tab-slot">
            <AppImage :src="`/img/promotion/icon${item.value}${currentType === item.value ? '-active' : ''}.png`"
              alt="" />
            <span v-html="item.label"></span>
          </div>
        </AppTab>
      </div>
    </div>

    <InvitePage v-if="currentType === '1'" />
    <InviteDaily v-else-if="currentType === '2'" />
    <InviteData v-else-if="currentType === '3'" />
  </div>
</template>

<style lang='scss' scoped>
.invite {
  color: #fff;

  .tab-bg {
    position: fixed;
    background-color: #000A1E;
    width: 100%;
    top: 110px;
    z-index: 1;

    .tab {
      background-image: linear-gradient(to bottom, #011a5100, #011A51);

      .tab-slot {
        display: flex;
        font-size: 26px;

        img {
          width: 54px;
          display: block;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
