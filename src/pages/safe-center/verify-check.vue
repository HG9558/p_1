<script lang="ts" setup name="VerifyCheck">
const countdowm = ref(0);
const startCountdown = () => {
  countdowm.value = 60
  const timer = setInterval(() => {
    countdowm.value--
    sessionStorage.setItem('countdowm', countdowm.value.toString())
    if (countdowm.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const router = useRouter()

const { phoneReg } = useRegExpPhone();

const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)

const emailRef = ref()
const phoneRef = ref()
const codeRef = ref()

const hasPhone = computed(() => userInfo.value && userInfo.value.phone_verify && +userInfo.value.phone_verify === 1)

const formdata = reactive({
  phone: userInfo.value.phone || '',
  email: userInfo.value.email || '',
  code: '',
})

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

// 绑定邮箱
const { run: runBindEmail, loading: bindEmailLoading } = useRequest(ApiBindEmail, {
  manual: true,
  onSuccess: () => {
    router.go(-1)
  }
})
// 邮箱验证码
const { run: runGetEmailCode, loading: emailCodeLoading } = useRequest(() => ApiOnlineEmailCode({ ty: 2, mail: formdata.email }), {
  manual: true,
  onSuccess: (data) => {
    if (data) {
      dealSid(data)
    }
  }
})

// 绑定手机号
const { run: runBindPhone, loading: bindPhoneLoading } = useRequest(ApiBindPhone, {
  manual: true,
  onSuccess: () => {
    router.go(-1)
  }
})
// 手机验证码
const { run: runGetPhoneCode, loading: codeLoading } = useRequest(() => ApiOnlinePhoneCode({ ty: 5, tel: formdata.phone }), {
  manual: true,
  onSuccess: (data) => {
    if (data) {
      dealSid(data)
    }
  }
})

const handleSendCode = () => {
  if (hasPhone.value) {
    // 手机已经绑定过，这里绑邮箱，是给用户填的邮箱发验证码
    if (emailRef.value.validation()) {
      runGetEmailCode()
    }
  } else {
    if (phoneRef.value.validation()) {
      runGetPhoneCode()
    }
  }
}

const confirmFn = () => {
  const { sid, ts } = sidData
  const { phone, email, code } = formdata
  if (hasPhone.value) {
    if (emailRef.value.validation() && codeRef.value.validation()) {
      runBindEmail({ sid, ts, email, code })
    }
  } else {
    if (phoneRef.value.validation() && codeRef.value.validation()) {
      runBindPhone({ sid, ts, phone, code })
    }
  }
}

watch(userInfo, (val) => {
  if (val) {
    formdata.phone = val.phone || ''
    formdata.email = val.email || ''
  }
})

</script>

<template>
  <div class="verify-check">
    <AppHeader left-arrow :title="userInfo.phone_verify && +userInfo.phone_verify === 1 ? 'Verificação de email' : 'Verificação de telefone'" placeholder />
    <section class="content">
      <template v-if="hasPhone">
        <AppInput
          ref="emailRef"
          v-model="formdata.email"
          :pattern="emailReg"
          msg="Erro de e-mail"
          placeholder="Por favor introduza o seu e-mail"
          icon-left="i-email-new"
          width="710"
          :err-height="34"
          :style-obj="{
            borderRadius: 'var(--app-px-8)',
            background:
              'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
            border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
          }"
        />
        <div class="divider"></div>
      </template>
      <template v-else>
        <AppInput
          ref="phoneRef"
          v-model="formdata.phone"
          :pattern="phoneReg"
          msg="Número de telefone errado"
          placeholder="Digite sua senha atual."
          icon-left="i-phone-sec"
          width="710"
          type="number"
          err-height="34"
          :style-obj="{
            borderRadius: 'var(--app-px-8)',
            background:
              'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
            border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
          }"
        >
        <template #left>
        <div :style="{ color: '#0ED1F4', paddingRight: 'var(--app-px-14)' }">+55</div>
      </template>
        </AppInput>
        
        <div class="divider"></div>
      </template>
      <AppInput
        ref="codeRef"
        v-model="formdata.code"
        :pattern="verifyCodeReg"
        placeholder="Código de verificação"
        msg="Erro no código de verificação"
        icon-left="reg-code"
        clearable
        width="710"
        err-height="34"
        :style-obj="{
          borderRadius: 'var(--app-px-8)',
          background:
            'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
          border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
        }"
      >
        <template #right>
          <div :style="{ paddingRight: 'var(--app-px-18)' }">
            <AppButton
              :loading="codeLoading || emailCodeLoading"
              @click="handleSendCode"
              fontSize="26"
              radius="46"
              whiteText
              yellowToRight
              bold
              width="130"
              height="46"
              center
              >{{ countdowm > 0 ? countdowm + "s" : "Mandar" }}
            </AppButton>
          </div>
        </template>
      </AppInput>
      <div class="btn-box">
        <AppButton
          :loading="bindEmailLoading || bindPhoneLoading"
          fontSize="28"
          radius="45"
          bold
          whiteText
          blueToRight
          width="580"
          height="90"
          center
          @click="confirmFn"
          >Enviar</AppButton
        >
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
.verify-check {
  .content {
    margin: 0 auto;
    width: 710px;
    padding-top: 30px;
    h3 {
      color: #fff;
      font-size: 28px;
      font-weight: 400;
      padding: 30px 0 28px;
      margin: 0;
    }
  }
}
</style>
