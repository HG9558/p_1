<script setup lang="ts" name="home">
// 9000000670
// 9000000671
// 9000000672
// 9000000673
// 9000000674
// 密码统一：123456
// 123
const list = [
  {
    label: 'Depósito',
    value: '1'
  }, {
    label: 'Retirar',
    value: '2'
  }, {
    label: 'Ali',
    value: '3'
  }, {
    label: 'TB',
    value: '4'
  }
]
const active = ref('2')

const sValue = ref('4')

const aname = ref()
const mypwd = ref()
const bname = ref()
const radioValue = ref(1)
const progress = ref(0);
setTimeout(() => {
  progress.value = 50
}, 500);
const changeRadio = (val: any) => {
  console.log(val)
}
const state = ref(false);

const anameRef = ref()
const anamePattern = ref(/^[0-9]+$/)

const submitValid = () => {
  console.log(anameRef.value.validation())
  console.log(anameRef.value.isValid)
}

const enterclick = () => {
  anamePattern.value = /^[a-z]+$/
}


const scrollTabList = [
  { label: 'tab11111111111', value: '1' },
  { label: 'tab2', value: '2' },
  { label: 'tab33333', value: '3' },
  { label: 'tab4', value: '4' },
  // { label: 'tab5', value: '5' },
  // { label: 'tab6', value: '6' },
  // { label: 'tab7', value: '7' },
  // { label: 'tab8', value: '8' },
  // { label: 'tab9', value: '9' },
]
const activeScrollTab = ref('1')
</script>

<template>
  <AppHeader left-arrow title="Esqueça a senha" />
  <div style="background: #666;padding-bottom: 100px;padding-top: 100px;">
    <AppRoundTab :list="scrollTabList" scroll width="500" v-model="activeScrollTab" />
    <AppInput plain align="right" placeholder="Retirada mínima R$0" />
    <div style="padding-bottom: var(--app-px-36);">
      <AppInput ref="anameRef" v-model="aname" :placeholder="`正则：${anamePattern}`" icon-left="phone-gray"
        :pattern="anamePattern" msg="Número de celular de 10 ou 11 dígitos" :max-length="7" />
    </div>

    <AppButton fontSize="26" radius="46" whiteText blue-to-right bold width="260" height="46" center @click="submitValid">
      提交表单校验
    </AppButton>
    <AppInput v-model="mypwd" placeholder="Senha (4-12 letras e números)" icon-left="key-gray" type="password" clearable>
      <template #left>
        <div :style="{ color: '#0ED1F4', paddingRight: 'var(--app-px-14)' }">+55</div>
      </template>
    </AppInput>
    <AppInput v-model="bname" placeholder="Código de verificação" icon-left="guard-gray" clearable>
      <template #right>
        <div :style="{ paddingRight: 'var(--app-px-18)' }">
          <AppButton fontSize="26" radius="46" whiteText yellowToRight bold width="130" height="46" center
            @click="enterclick">Enviar
          </AppButton>
        </div>
      </template>
    </AppInput>
    <!-- <AppGameItem /> -->
    <div style="background: var(--app-container-bg);padding: 30px;border-radius: 20px;">
      <AppProgress :value="100" :max="100" :width="480" placeholder="Quantidade total de recarga" />
    </div>
    <div style="background: var(--app-container-bg);padding: 30px;border-radius: 20px;">
      <AppProgress :value="progress" :max="100" :width="480" />
    </div>
    <AppRadioGroup v-model="radioValue" @change="changeRadio">
      <AppRadio label="Canal de pagamento rápido 1" :value="1" />
      <AppRadio label="Canal de pagamento rápido 2" :value="2" />
    </AppRadioGroup>
    <!-- 单独使用 -->
    <div>
      单独使用radio 绑定值为boolean
      <AppRadio v-model="state" @change="changeRadio" />
    </div>

    <AppTab :list-data="list" v-model="active">
      <template v-slot="slotProps">
        <AppImage class="icons" :src="`/icons/game-tab${slotProps.index}.png`" alt="" />
      </template>
    </AppTab>
    <!-- <AppVipTab :vip="5" :totalLevel="25" /> -->
    <AppButton :disabled="true" fontSize="32" radius="16" whiteText blueToRight width="580" height="90" center>click
    </AppButton>
    <AppEmpty />
    <AppSelect v-model="sValue" :list-data="list" />
  </div>
</template>

<style>
.www {
  width: 750px;
  background: red;
}

.icons {
  width: 50px;
}
</style>
