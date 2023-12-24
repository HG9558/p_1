<script setup lang="ts" name="app-find-pwd">
// const router = useRouter()
const appStore = useAppStore();
const {
  findPasswordDialogVisible,
} = storeToRefs(appStore);
enum TabActive {
  findPass = 'login',
}
const tabData = ref([
  {
    label: 'Esqueça a senha',
    value: TabActive.findPass
  }
])
const tabActive = ref(TabActive.findPass)
const phoneRef = ref()
const emailRef = ref()
const pwdRef = ref()
const codeRef = ref()
const isPhone = ref(true)
// const { userNameReg } = useRegExpUserName();
const { phoneReg } = useRegExpPhone();
const fromData = reactive({
  email: '',
  phone: '',
  password: '',
  code: '',
  sid: '',
  ts: ''
})

const { run: runResetPwd, loading: resetLoading } = useRequest(() => ApiResetPwd(fromData), {
  manual: true,
  onSuccess: () => {
    appStore.setFindPasswordDialogVisible(false)
    localStorage.clear()
    location.replace(location.origin)
  }
})

const submit = () => {
  // emailRef.value.validation();
  if (fromData.code && codeRef.value.isValid && fromData.password && pwdRef.value.isValid)
  runResetPwd()
}

const { run: runSendCode, loading: codeLoading } = useRequest(() => ApiSendOfflineSms({ flag: 'text', tel: fromData.phone, ty: 2 }), {
  manual: true,
  onSuccess(data: string) {
    const [sid, ts] = data.split(':')
    fromData.sid = sid
    fromData.ts = ts
    startCountdown()
    showToast('Código de verificação enviado')
  },
})

// 邮箱注册验证码获取
const { run: runEmailCode, loading: emailCodeLoading } = useRequest(() => ApiEmailCode({ ty: '2', mail: fromData.email }), {
  manual: true,
  onSuccess: (data) => {
    const [sid, ts] = data.split(':')
    fromData.sid = sid
    fromData.ts = ts
    startCountdown()
    showToast('Código de verificação enviado')
  }
})

const countdowm = ref(0)
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

const handleSendCode = () => {
  if (isPhone.value) {
    phoneRef.value.validation();
  } else {
    emailRef.value.validation();
  }
  const isPass = isPhone.value ? phoneRef.value.isValid : emailRef.value.isValid
  if (isPass) {
    if (isPhone.value) {
      runSendCode()
    } else {
      runEmailCode()
    }
  }
}

const codeDisabled = computed(() => {
  if (codeLoading.value || emailCodeLoading.value) {
    return true
  }
  if (isPhone.value && phoneReg.value.test(fromData.phone) && countdowm.value <= 0) {
    return false
  }
  if (!isPhone.value && emailReg.test(fromData.email) && countdowm.value <= 0) {
    return false
  }
  return true
})

const changeRegType = (bool: boolean) => {
  isPhone.value = bool
  fromData.code = ''
  fromData.password = ''
}
</script>

<template>
  <van-popup class="app-login-register" v-model:show="findPasswordDialogVisible" teleport="body" round>
    <div class="content">
      <div class="title">
        <AppTab :list-data="tabData" v-model="tabActive" :height="84" active-color="#0ED1F4" />
      </div>
      <div class="login-img">
        <div class="reg-tab" :class="{
          'active': !isPhone
        }" @click="changeRegType(false)">
          <div class="email" :class="{
            'active': !isPhone
          }"></div>
        </div>
        <div class="line"></div>
        <div class="reg-tab" :class="{
          'active': isPhone
        }" @click="changeRegType(true)">
          <div class="phone" :class="{
            'active': isPhone
          }"></div>
        </div>
      </div>
      <div class="app-login">
        <div class="phone" v-show="isPhone">
          <AppInput v-model="fromData.phone" ref="phoneRef" :pattern="phoneReg" icon-left="phone-gray"
            placeholder="Tu nùmero de celular " msg="Error Phone">
            <template #left>
              <div :style="{ color: '#0ED1F4', paddingRight: 'var(--app-px-14)' }">+55</div>
            </template>
          </AppInput>
        </div>
        <div class="email" v-show="!isPhone">
          <AppInput v-model="fromData.email" ref="emailRef" :pattern="emailReg" icon-left="reg-email"
            placeholder="Email" msg="Error Email" />
        </div>
        <div class="code">
          <AppInput ref="codeRef" v-model="fromData.code" placeholder="Código de verificação" icon-left="i-code-gray" clearable :pattern="/^[0-9]{4}$/" msg="4 números">
            <template #right>
              <div :style="{ paddingRight: 'var(--app-px-14)' }">
                <AppButton :loading="codeLoading || emailCodeLoading" :disabled="codeDisabled" fontSize="26" radius="46" whiteText yellowToRight bold width="130" height="46" center @click="handleSendCode">{{ countdowm > 0 ?
                countdowm + 's' : 'Enviar' }}
                </AppButton>
              </div>
            </template>
          </AppInput>
        </div>
        <div class="password">
          <AppInput v-model="fromData.password" placeholder="Senha (6-12 letras e números)" icon-left="key-gray"
            type="password" clearable ref="pwdRef" :pattern="passwordReg" msg="8-20 letras e números" />
        </div>
        <div class="submit">
          <AppButton @click="submit" :loading="resetLoading" class="" width="580" height="90" bold blue-to-right :radius="45" white-text font-size="28">
            Redefinir senha
          </AppButton>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
@import '../theme/mixin.scss';
.content {
  width: 634px;
  border-radius: 20px;
  background: #011A51;

  .title {
    padding: 20px 0;
  }

  .phone, .email {
    padding-top: 0;
  }
}

.email,
.phone {
  // padding-top: 10px;
  padding-top: 40px;
  padding-bottom: 40px;
}

.password {
  padding-bottom: 50px;
}

.code {
  padding-bottom: 40px;
}

.submit {
  padding-bottom: 30px;
  button.grey-color {
    color: rgba(255, 255, 255, 0.50);
  }
}

.app-login {
  padding: 0 27px;
}


.login-img {
  text-align: center;
  padding-top: 40px;
  padding-bottom: 35px;
  // padding: 0 0 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .line {
    width: 1px;
    height: 72px;
    background: rgba(255, 255, 255, 0.25);
    margin: 0 36px;
  }

  img {
    width: 72px;
    height: 72px;
    vertical-align: middle;
  }

  .reg-tab {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    background: linear-gradient(180deg, #044B9A 0%, #011A51 100%), #D9D9D9;
    box-shadow: 0px -3px 6px 0px rgba(255, 255, 255, 0.25) inset, 0px -2px 3px 0px #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .15s;

    &.active {
      background: linear-gradient(180deg, #FFD500 0%, #FF9901 100%), linear-gradient(180deg, #044B9A 0%, #011A51 100%), #D9D9D9;
    }

    .email {
      width: 100%;
      height: 100%;
      // background: url('/icons/i-email.png') no-repeat center center;
      @include webp('/icons/i-email.png');
      background-size: 35px auto;
      background-position: center center;

      &.active {
        // background: url('/icons/i-email-active.png') no-repeat center center;
        @include webp('/icons/i-email-active.png');
        background-size: 35px auto;
        background-position: center center;
      }
    }

    .phone {
      width: 100%;
      height: 100%;
      // background: url('/icons/i-phone.png') no-repeat center center;
      @include webp('/icons/i-phone.png');
      background-size: 25px auto;
      background-position: center center;

      &.active {
        // background: url('/icons/i-phone-active.png') no-repeat center center;
        @include webp('/icons/i-phone-active.png');
        background-size: 25px auto;
        background-position: center center;
      }
    }
  }
}


.retrieve {
  width: 260px;
  height: 46px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #0ED1F4;
  color: #0ED1F4;
  text-align: center;
  font-size: 26px;
  line-height: 46px;
}
</style>
