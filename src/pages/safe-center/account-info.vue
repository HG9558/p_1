<script lang="ts" setup name="AccountInfo">
const router = useRouter()

const phoneRef = ref()
const emailRef = ref()
const telgRef = ref()

const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)

const formdata = reactive({
  phone: userInfo.value.phone || '',
  email: userInfo.value.email || '',
  telegram: userInfo.value.telegram || '',
})

const { phoneReg } = useRegExpPhone();

const normalStyle = {
  borderRadius: 'var(--app-px-8)',
  background:
    'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
  border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
}

const disableStyle = {
  borderRadius: 'var(--app-px-8)',
}

const { run: runUpdateInfo, loading: updateLoading } = useRequest(ApiUpdateUserInfo, {
  manual: true,
  onSuccess: () => {
    router.go(-1)
  }
})

const confirmFn = () => {
  if (phoneRef.value.validation() && emailRef.value.validation() && telgRef.value.validation()) {
    runUpdateInfo({ phone: userInfo.value.phone ? '' : formdata.phone, email: userInfo.value.email ? '' : formdata.email, telegram: formdata.telegram })
  }
}

watch(userInfo, (val) => {
  if (val) {
    formdata.phone = val.phone || ''
    formdata.email = val.email || ''
    formdata.telegram = val.telegram || ''
  }
})

</script>

<template>
  <div class="account-info">
    <AppHeader left-arrow title="Minha conta" placeholder />
    <section class="content">
      <h3>Nome do usuário: <span>{{ userInfo.username }}</span></h3>
      <AppInput
        ref="emailRef"
        v-model="formdata.email"
        :pattern="emailReg"
        msg="Erro de e-mail"
        placeholder="Por favor introduza o seu e-mail"
        icon-left="i-email-new"
        :disabled="!!userInfo.email"
        width="710"
        :err-height="34"
        :style-obj="userInfo.email ? disableStyle : normalStyle"
      />
      <div class="divider"></div>
      <AppInput
        ref="phoneRef"
        v-model="formdata.phone"
        :pattern="phoneReg"
        msg="Número de telefone errado"
        :disabled="!!userInfo.phone"
        placeholder="Por favor introduza o seu phone"
        icon-left="i-acc-card"
        width="710"
        :err-height="34"
        :style-obj="userInfo.phone ? disableStyle : normalStyle"
      />
      <div class="divider"></div>
      <AppInput
        ref="telgRef"
        v-model="formdata.telegram"
        placeholder="Por favor, preencha o seu Telegram"
        icon-left="i-telg"
        width="710"
        msg="Por favor, preencha o seu Telegram"
        required
        :disabled="!!userInfo.telegram"
        :err-height="34"
        :style-obj="userInfo.telegram ? disableStyle : normalStyle"
      />
      <div v-if="!userInfo.phone || !userInfo.email || !userInfo.telegram" class="btn-box">
        <AppButton :loading="updateLoading" fontSize="28" radius="45" bold whiteText blueToRight width="580" height="90" center @click="confirmFn">Enviar</AppButton>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .btn-box {
    padding-top: 36px;
  }
  .divider {
    height: 34px;
  }
  .account-info {
    .content {
      margin: 0 auto;
      width: 710px;
      h3 {
        color: #FFF;
        font-size: 28px;
        font-weight: 400;
        padding: 30px 0 28px;
        margin: 0;
      }
    }
  }
</style>
