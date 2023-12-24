<script setup lang="ts" name="AppTab">
const props = withDefaults(defineProps<{
  modelValue?: string;
  listData: ListData[];
  height?: number;
  activeColor?: string;
}>(), {
  modelValue: '',
  height: 80,
});
const emit = defineEmits(['update:modelValue', 'change'])

const activeValue = useVModel(props, 'modelValue', emit);
const buttomLeft = ref(0);
const trans = ref(false);
const srcoll = ref<HTMLDivElement | null>(null);
const after = ref<HTMLDivElement | null>(null);
const tab = ref<HTMLDivElement | null>(null);

const currentIndex = computed(() => {
  return props.listData.findIndex(item => item.value === activeValue.value);
});

const setSrcollWidth = () => {
  const items = srcoll.value?.querySelectorAll('.item');
  if (items) {
    let width = 0;
    items.forEach(item => {
      width += item.clientWidth;
    });
    srcoll.value!.style.width = `${width}px`;
  }
}

const itemClick = (index: number) => {
  activeValue.value = props.listData[index].value;
  // const items = srcoll.value?.querySelectorAll('.item');
  // const item = items?.[index] as HTMLDivElement;
  // const itemWidth = item.clientWidth;
  // const afterWidth = after.value?.clientWidth || 0;
  // const offsetLeft = (itemWidth - afterWidth) / 2
  // buttomLeft.value = item.offsetLeft + offsetLeft;

  // item.scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'center',
  //   inline: 'center',
  // });
}

const itemScroll = (v: any) => {
  setTimeout(() => {
    const items = srcoll.value?.querySelectorAll('.item');
    const item = items?.[+v] as HTMLDivElement;
    const itemWidth = item.clientWidth;
    const afterWidth = after.value?.clientWidth || 0;
    const offsetLeft = (itemWidth - afterWidth) / 2
    buttomLeft.value = item.offsetLeft + offsetLeft;
    item.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, 0);
}

watch(activeValue, (v, old) => {
  console.log('ac ==== ', v, old)
  const idx = props.listData.findIndex(item => item.value === v);
  itemScroll(idx)
})

const changeItem = (index: number) => {
  trans.value = true;
  itemClick(index)
  emit('change')
}

onMounted(() => {
  setSrcollWidth();
  nextTick(() => { itemScroll(currentIndex.value) })
});
</script>

<template>
  <div class="app-tab" ref="tab" :style="{
    '--tab-height': `var(--app-px-${height})`,
    '--active-color': activeColor || '#fff'
  }">
    <div class="scroll" ref="srcoll" :style="{
      '--buttom-left': buttomLeft + 'px',
    }">
      <div class="item" :class="{ 'active': currentIndex === i }" v-for="item, i in listData" :key="item.label"
        @click="changeItem(i)">
        <!-- <AppImage class="icons" src="/icons/game-tab1.png" alt=""> -->
        <slot :item="item" :index="i">
          <span v-html="item.label"></span>
        </slot>
      </div>
      <div class="after" :class="{
        'trans': trans,
      }" ref="after"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-tab {
  font-size: 26px;
  height: var(--tab-height);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  max-width: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  .scroll {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    min-width: 100%;
    height: 100%;

    .after {
      position: absolute;
      left: var(--buttom-left);
      bottom: 0;
      width: 80px;
      height: 6px;
      background: rgba(255, 255, 255, 0.4);
      background: #0ED1F4;
      box-shadow: 0px -2px 6px 0px #0ED1F4;
      border-radius: 10px;

      &.trans {
        transition: all 0.3s ease-in-out;
      }
    }

    & .item {
      height: 100%;
      padding: 0 20px;
      transition: all 0.3s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: pre;

      .icons {
        width: 54px;
      }

      &.active {
        color: var(--active-color);
        font-weight: 700;
      }
    }
  }
}
</style>
