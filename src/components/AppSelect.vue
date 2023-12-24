<script setup lang="ts" name="AppSelect">
const props = withDefaults(defineProps<{
  modelValue?: string;
  listData: Array<{ label: string; value: string;[k: string]: any }>;
  width?: number
  plain?: boolean
}>(), {
  modelValue: '',
})
const emit = defineEmits(['update:modelValue', 'onSelect'])
const selectValue = useVModel(props, 'modelValue', emit)
const show = ref(false)

const btnClick = () => {
  show.value = !show.value
}

// const itemClick = (value: string) => {
//   selectValue.value = value
//   show.value = false
// }

const selectLabel = computed(() => {
  const item = props.listData.find(item => item.value === selectValue.value)
  return item ? item.label : ''
})

const onConfirm = (selectedValues: any) => {
  show.value = false
  selectValue.value = selectedValues.selectedValues[0]
  emit('onSelect')
}

defineExpose({ btnClick })

</script>

<template>
  <button v-if="!plain" class="app-select" @click="btnClick" :style="{
    width: props.width ? `var(--app-px-${props.width})` : '100%'
  }">
    <span>
      <slot>{{ selectLabel }}</slot>
    </span>
    <AppImage class="down" src="/icons/down.png" alt="" />
  </button>
  <van-popup v-model:show="show" class="van-popup-transparent " position="bottom" teleport="body">
    <div class="popup-ul">
      <van-picker :columns="listData" :columns-field-names="{
        text: 'label',
        value: 'value'
      }" confirm-button-text="Confirme" cancel-button-text="Cancelar" title="Selecione a data" @cancel="show = false"
        @confirm="onConfirm" />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.app-select {
  --select-color: #0ED1F4;
  --select-color-opacity: rgba(14, 209, 244, 0.5);
  height: 60px;
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid var(--select-color);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--select-color);
  transition: all 0.15s ease-in-out;
  font-size: 24px;

  .down {
    height: 16px;
  }

  &:focus {
    border-color: var(--select-color);
    color: var(--select-color);
  }

  &:active {
    border-color: var(--select-color-opacity);
    color: var(--select-color-opacity);
  }
}


.popup-ul {
  list-style: none;
  color: #fff;
  --van-text-color: #fff;
  --van-font-bold: 700;
  --van-picker-mask-color: linear-gradient(180deg, rgba(1, 26, 81, .9), rgba(1, 26, 81, .4)), linear-gradient(0deg, rgba(1, 26, 81, .9), rgba(1, 26, 81, .4));
  --van-picker-option-text-color: #fff;
  --van-picker-title-font-size: 36px;
  --van-picker-action-font-size: 28px;
  --van-picker-toolbar-height: 120px;
  --van-border-color: rgba(255, 255, 255, 0.25);

  :deep(.van-picker) {
    border-radius: 20px 20px 0px 0px;
    background: linear-gradient(0deg, #011A51 0%, #011A51 100%), #D9D9D9;
  }

  .item {
    height: 90px;
    color: #fff;
    text-align: center;
    line-height: 90px;
  }
}
</style>
