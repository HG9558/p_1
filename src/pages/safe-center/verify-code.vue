<script lang="ts" setup name="VerifyCode">
const countdowm = ref(0);
const startCountdown = () => {
  countdowm.value = 300
  const timer = setInterval(() => {
    countdowm.value--
    sessionStorage.setItem('countdowm', countdowm.value.toString())
    if (countdowm.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const route = useRoute()
const router = useRouter()

const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)

const codeRef = ref()
const code = ref('')

const hasPhone = computed(() => userInfo.value && userInfo.value.phone_verify && +userInfo.value.phone_verify === 1)

const sidData = reactive({
  sid: '',
  ts: ''
})
const dealSid = (data: string) => {
  const [sid, ts] = data.split(':')
  sidData.sid = sid
  sidData.ts = ts
  startCountdown()
  showToast('Código de verificação enviado')
}

const { run: runGetPhoneCode, loading: codeLoading } = useRequest(() => ApiOnlinePhoneCode({ ty: 3 }), {
  manual: true,
  onSuccess: (data) => {
    if (data) {
      dealSid(data)
    }
  }
})

const { run: runGetEmailCode, loading: emailCodeLoading } = useRequest(() => ApiOnlineEmailCode({ ty: 3 }), {
  manual: true,
  onSuccess: (data) => {
    if (data) {
      dealSid(data)
    }
  }
})

// 更新支付密码
const { run: runUpdatePayPwd, loading: paypwdLoading } = useRequest(ApiUpdatePayPwd, {
  manual: true,
  onSuccess: () => {
    appStore.runGetMemberInfo()
    router.go(-2)
  }
})

const loading = computed(() => paypwdLoading.value)

const handleSendCode = () => {
  if (hasPhone.value) {
    runGetPhoneCode()
  } else {
    runGetEmailCode()
  }
}

const confirmFn = () => {
  if (codeRef.value.validation()) {
    switch (route.query.type) {
      case 'paypwd':
        runUpdatePayPwd({ ty: hasPhone.value ? 1 : 2, sid: sidData.sid, ts: sidData.ts, code: code.value, password: history.state.payPwd, old: history.state.oldPayPwd || undefined })
        break
      default:
        break
    }
  }
}

onMounted(() => {
  setTimeout(() => {
    handleSendCode()
  }, 1000);
})

</script>

<template>
  <div class="verify-code">
    <AppHeader left-arrow title="Código de verificação" placeholder />
    <section class="content">
      <h3>O código de verificação foi enviado para {{ userInfo.phone_verify && +userInfo.phone_verify === 1 ?
        userInfo.phone : userInfo.email }}</h3>
      <AppInput v-model="code" ref="codeRef" :pattern="verifyCodeReg"
        placeholder="por favor insira o código de verificação" msg="Erro no código de verificação" icon-left="reg-code"
        clearable width="710" :style-obj="{
          borderRadius: 'var(--app-px-8)',
          background:
            'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
          border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
        }">
        <template #right>
          <div :style="{ paddingRight: 'var(--app-px-18)' }">
            <AppButton :loading="codeLoading || emailCodeLoading" @click="handleSendCode" fontSize="26" radius="46"
              whiteText yellowToRight bold width="130" height="46" center>{{ countdowm > 0 ? countdowm + "s" : "Mandar" }}
            </AppButton>
          </div>
        </template>
      </AppInput>
      <div class="btn-box">
        <AppButton :loading="loading" fontSize="28" radius="45" bold whiteText blueToRight width="580" height="90" center
          @click="confirmFn">Terminar</AppButton>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.btn-box {
  padding-top: 40px;
}

.divider {
  height: 34px;
}

.verify-code {
  .content {
    margin: 0 auto;
    width: 710px;

    h3 {
      color: #fff;
      font-size: 26px;
      font-weight: 400;
      padding: 22px 0 30px;
      padding-left: 22px;
      margin: 0;
    }
  }
}
</style>
