<script setup lang='ts' name='date-picker'>
interface Props {
  modelValue: boolean
  group?: boolean
  startDate?: string
  initialDate?: string
  endDate?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm', 'change'])

const showPopup = computed(() => props.modelValue)
const initialDate = ref(props.initialDate?.split('/') ?? [
  new Date().getFullYear().toString(),
  (new Date().getMonth() + 1).toString(),
  new Date().getDate().toString(),
])
const startDate = ref(props.startDate?.split('/') ?? [
  new Date().getFullYear().toString(),
  (new Date().getMonth() + 1).toString(),
  new Date().getDate().toString(),
])
const endDate = ref(props.endDate?.split('/') ?? [
  new Date().getFullYear().toString(),
  (new Date().getMonth() + 1).toString(),
  new Date().getDate().toString(),
])
const minDate = new Date(2020, 0, 1)
const maxDate = new Date()

const onCancel = () => {
  emit('update:modelValue', false)
}
const onConfirm = (data: any) => {
  emit('update:modelValue', false)
  if (props.group) {
    const start = data[0].selectedValues.join('/')
    const end = data[1].selectedValues.join('/')
    emit('confirm', { start, end })
  }
  else {
    emit('confirm', data.selectedValues.join('/'))
  }
}
const onChange = (data: any) => {
  emit('change', data.selectedValues.join('/'))
}
</script>
<template>
  <van-popup v-model:show="showPopup" @click-overlay="onCancel" position="bottom"
    :style="{ borderRadius: '20px 20px 0 0 ' }">
    <van-picker-group v-if="group" cancel-button-text="Cancelar" confirm-button-text="Confirme"
      :tabs="['data de início', 'data final']" @confirm="onConfirm" @cancel="onCancel">
      <template #title>
        <span class="title">Selecione a data</span>
      </template>
      <van-date-picker v-model="startDate" :min-date="minDate" :max-date="maxDate" />
      <van-date-picker v-model="endDate" :min-date="minDate" :max-date="maxDate" />
    </van-picker-group>
    <van-date-picker v-else cancel-button-text="Cancelar" confirm-button-text="Confirme" v-model="initialDate"
      :min-date="minDate" :max-date="maxDate" @cancel="onCancel" @confirm="onConfirm" @change="onChange">
      <template #title>
        <span class="title">Selecione a data</span>
      </template>
    </van-date-picker>
  </van-popup>
</template>
<style lang="scss" scoped>
.title {
  color: #fff;
  font-weight: 700;
}
</style>

<style lang='scss'>
:root {
  --van-picker-background: linear-gradient(0deg, rgb(1, 26, 81) 0%, #011A51 100%), #D9D9D9;
  --van-picker-mask-color: linear-gradient(180deg, rgba(1, 26, 81, .9), rgba(1, 26, 81, .4)), linear-gradient(0deg, rgba(1, 26, 81, .9), rgba(1, 26, 81, .4));
  --van-picker-option-text-color: #fff;
  --van-picker-confirm-action-color: #0ED1F4;
  --van-picker-cancel-action-color: #FFFFFFB2;
  --van-popup-background: transparent;
  --van-picker-group-background: #011A51;
  --van-tabs-nav-background: #011A51;
  --van-tab-text-color: rgba(255, 255, 255, .7);
  --van-tab-active-text-color: rgba(255, 255, 255, .7);

  [class*=van-hairline]:after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    border: 1px solid #FFFFFF40;
    border-left: none;
    border-right: none;
    transform: scale(.5);
  }
}
</style>
