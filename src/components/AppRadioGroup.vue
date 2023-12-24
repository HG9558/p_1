<template>
    <div class='c-app-radio'>
        <slot></slot>
    </div>
</template>
<script setup lang='ts'>
    import {provide,watchEffect,computed,readonly} from 'vue';
    const props = defineProps<{modelValue:any}>();
    const emit = defineEmits(['update:modelValue','change']);
    provide('parent',{
                modelValue: readonly(computed(() => props.modelValue)),
                updateValue:(val:any)=>{emit('update:modelValue',val) }
            })
    watchEffect(()=>{
            emit('change',props.modelValue)
    })
</script>
<style lang='scss' scoped>
    .c-app-radio{
        
    }
</style>