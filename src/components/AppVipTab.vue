<script setup lang='ts' name='vip-tab'>
type Props = {
  userLevel: number; // 当前等级
  list: { label: string, value: number }[]
}

const props = defineProps<Props>()
const emit = defineEmits(['change'])

const activeVip = ref(-1)
const onClick = (d: any) => {
  activeVip.value = d.value
  emit('change', d)
}
const activeTab = computed(() => {
  if (activeVip.value > -1) {
    return activeVip.value
  }
  return props.userLevel
})
</script>
<template>
  <div class="vip-tab">
    <van-tabs :swipe-threshold="4" line-height="0" background="transparent">
      <van-tab v-for="item in list">
        <template #title>
          <div class="tab" :class="activeTab === item.value ? 'tab-active' : ''" @click="onClick(item)">
            <AppImage v-if="userLevel < item.value" class="icon" src="/icons/i-lock.png" alt="" />
            {{ item.label }}
          </div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang='scss' scoped>
.vip-tab {
  width: 100%;
}

.tab {
  width: 140px;
  height: 56px;
  border-radius: 16px;
  background-image: linear-gradient(180deg, #044B9A 0%, #011A51 100%);
  box-shadow: 0px -3px 6px 0px #FFFFFF40 inset, 0px -2px 3px 0px #FFFFFF;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  margin: 0px 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    width: 30px;
    margin-right: 2px;
  }
}

.tab-active {
  background-image: linear-gradient(180deg, #FFD500 0%, #FF9901 100%);
  color: #000;
}
</style>
<style>
:root {
  --van-tabs-default-color: transparent !important;
  --van-padding-xs: 0 !important;
  --van-padding-sm: 0 !important;
  --van-padding-md: 0 !important;
  --van-border-width: 0 !important;
}
</style>
