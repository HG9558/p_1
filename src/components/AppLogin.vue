<script setup lang="ts" name="app-login">
const appStore = useAppStore();
// const { userInfo } = storeToRefs(appStore);
const fromData = reactive({
  username: '',
  password: ''
})
const { phoneReg } = useRegExpPhone();

// 同时验证 phoneReg 和  emailReg，只要有一个通过就行
const usernameReg = new RegExp('(?:' + phoneReg.value.source + '|' + emailReg.source + ')\\b')

const loginRef = ref()
const passwordRef = ref()

// const changeLan = () => {
//   appStore.setLanguage(Languages.EN_US)
// }

const openFindPwd = () => {
  appStore.setLoginDialogVisible(false)
  appStore.setFindPasswordDialogVisible(true)
}

const { run: runLogin, loading } = useRequest(() => ApiLogin({
  ...fromData,
  device_no: 'asdfasdf234',
}), {
  manual: true,
  loadingDelay: 500,
  onSuccess(data) {
    openLoginDialog(false)
  },
  onError: (err: any) => {
    if (err && err.data) {
      DealLoginError(err.data)
    }
  }
})

const login = () => {
  loginRef.value.validation();
  passwordRef.value.validation();
  // 是否验证通过
  const isPass = [loginRef.value.isValid, passwordRef.value.isValid].every(item => item)

  if (isPass) {
    runLogin()
  }
}
</script>

<template>
  <div class="app-login">
    <div class="login-img">
      <AppImage src="/img/login-logo.png" alt="" />
    </div>
    <p class="name">LB88</p>
    <div class="username">
      <AppInput v-model="fromData.username" ref="loginRef" :pattern="usernameReg" icon-left="i-user"
        placeholder="Por favor, insira o nome de usuário" msg="Número de celular de 10 ou 11 dígitos" :err-height="42" />
    </div>
    <div class="password">
      <AppInput v-model="fromData.password" ref="passwordRef" :pattern="passwordReg" :err-height="42"
        placeholder="Senha (6-12 letras e números)" msg="Senha (6-12 letras e números)" icon-left="key-gray"
        type="password" clearable />
    </div>
    <div class="retrieve" @click="openFindPwd">
      Esqueça a senha
    </div>
    <div class="submit">
      <AppButton @click="login" :loading="loading" width="580" height="90" bold blue-to-right :radius="100" white-text>
        Entrar
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.username {
  // padding-top: 10px;
  padding-bottom: 40px;
}

.password {
  // padding-top: 10px;
  padding-bottom: 40px;
}

.submit {
  padding-top: 50px;
  padding-bottom: 30px;
}

.app-login {
  padding: 30px 27px 0 27px;
}

.name {
  color: #FFF;
  text-align: center;
  font-size: 26px;
  height: 52px;
  line-height: 52px;
}

.login-img {
  text-align: center;
  // padding: 0 0 50px 0;

  img {
    width: 100px;
    height: 100px;
    vertical-align: middle;
  }
}

.retrieve {
  width: 260px;
  height: 46px;
  border-radius: 8px;
  border: 1px solid #0ED1F4;
  color: #0ED1F4;
  text-align: center;
  font-size: 26px;
  line-height: 46px;
}
</style>
