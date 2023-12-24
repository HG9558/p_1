<script setup lang='ts' name='round-tab'>
interface Props {
  width?: string | number
  modelValue: string;
  list: ListData[];
  height?: number;
  scroll?: boolean;
  duration?: number // 单位秒
  threshold?: number // 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动
}

const props = withDefaults(defineProps<Props>(), {
  width: 0,
  threshold: 5
})
const emit = defineEmits(['update:modelValue', 'change'])

const onClick = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const activeIndex = computed(() => props.list.findIndex((i) => i.value === props.modelValue))

const needScroll = ref(false)
const dynamicWidth = ref(0)
const windowWidth = window.innerWidth

onMounted(() => {
  if (props.width === 0) {
    const list = Array.from(document.querySelectorAll('.app-round-tab'))
    const totalWidth = list.reduce((pre, cur) => pre + cur.offsetWidth, 0)
    if (totalWidth > windowWidth) {
      needScroll.value = true
    } else {
      dynamicWidth.value = totalWidth
    }
  }
})
</script>
<template>
  <div v-if="scroll || needScroll" class="scroll-tab-wrapper" :style="{ width: $toPx(+width) }">
    <van-tabs :swipe-threshold="threshold" :duration="duration" type="card" v-model:active="activeIndex" line-height="0"
      background="transparent">
      <van-tab v-for="tab, i in list" :key="tab.value">
        <template #title>
          <div class="scroll-tab" :class="{ 'scroll-tab-active': i === activeIndex }" @click="onClick(tab.value)">
            {{ tab.label }}
          </div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
  <div v-else class="app-round-tabs" :style="{ width: width ? $toPx(+width) : dynamicWidth + 'px' }">
    <div @click="onClick(tab.value)" class="app-round-tab" v-for="tab, i in list" :key="tab.value"
      :class="activeIndex === i ? 'tab-active' : ''">
      {{ tab.label }}
    </div>

  </div>
</template>

<style lang='scss' scoped>
.app-round-tabs {
  // width: 100%;
  height: 54px;
  border-radius: 100px;
  background: #011A51;
  display: flex;


  .app-round-tab {
    color: #FFFFFF66;
    font-size: 24px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
    padding: 0 30px;
    white-space: nowrap;
  }

  .tab-active {
    background: linear-gradient(358deg, #1373EF 0%, #0ED1F4 100%), #000;
    font-weight: 700;
    color: #fff;
  }
}

.scroll-tab-wrapper {
  height: 54px;
  border-radius: 1000px;
  background: #011A51;

  .scroll-tab {
    height: 56px;
    color: #FFFFFF66;
    font-size: 24px;
    line-height: 56px;
    padding: 0 30px;
  }

  .scroll-tab-active {
    font-weight: 700;
    color: #fff;
    border-radius: 1000px;
    background: linear-gradient(358deg, #1373EF 0%, #0ED1F4 100%), #000;
  }
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
