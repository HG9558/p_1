<template>
  <div class='c-app-radio' :class="[parent && parent?.modelValue && 'c-app-radio-item']">
    <div class="">{{ props.label }}</div>
    <div @click="onRadioChange">
      <AppImage src="/icons/i-radio-active.png" alt=""
        v-if="(parent && parent?.modelValue?.value === props.value) || !parent && props.modelValue" />
      <AppImage src="/icons/i-radio-no.png" alt="" v-else />
    </div>
  </div>
</template>
<script setup lang='ts'>
import { inject } from 'vue';
export interface AppRadioItemProps {
  label?: string,
  value?: any,
  modelValue?: Boolean,
}
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps<AppRadioItemProps>();
const parent: any = props.modelValue ?? inject('parent');
const onRadioChange = () => {
  if (parent?.updateValue) {
    parent.updateValue(props.value);
  } else {
    emit('update:modelValue', !props.modelValue)
    emit('change', !props.modelValue);
  }

}
</script>
<style lang='scss' scoped>
.c-app-radio {
  display: inline-block;
}

.c-app-radio-item {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-size: 28px;
  color: #fff;
  border-radius: 8px;
  background: var(--app-container-bg);
  border: 1px solid #FFFFFF1A;
}

img {
  width: 32px;
  height: 32px;
  display: block;
}
</style>
