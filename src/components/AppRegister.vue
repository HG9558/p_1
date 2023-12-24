<template>
  <div class="app-login">
    <!-- <div class="login-img">
      <div
        class="reg-tab"
        :class="{
          active: !isPhone,
        }"
        @click="changeRegType(false)"
      >
        <div
          class="email"
          :class="{
            active: !isPhone,
          }"
        ></div>
      </div>
      <div class="line"></div>
      <div
        class="reg-tab"
        :class="{
          active: isPhone,
        }"
        @click="changeRegType(true)"
      >
        <div
          class="phone"
          :class="{
            active: isPhone,
          }"
        ></div>
      </div>
    </div> -->
    <div class="phone">
      <AppInput
        v-model="fromData.phone"
        ref="phoneRef"
        :pattern="phoneReg"
        icon-left="phone-gray"
        placeholder="Phone"
        msg="Número de telefone errado"
      >
        <template #left>
          <div :style="{ color: '#0ED1F4', paddingRight: 'var(--app-px-14)' }">
            +55
          </div>
        </template>
      </AppInput>
    </div>

    <div class="phone">
      <AppInput
        v-model="fromData.confirm_phone"
        ref="confirmPhoneRef"
        :required="true"
        icon-left="phone-gray"
        placeholder="Phone"
        msg="Número de telefone inconsistente"
        :confirmVal="fromData.phone"
        :isConfirmPhone="true"
      >
        <template #left>
          <div :style="{ color: '#0ED1F4', paddingRight: 'var(--app-px-14)' }">
            +55
          </div>
        </template>
      </AppInput>
    </div>
    <!--  <div class="email" v-show="!isPhone">
      <AppInput
        v-model="fromData.email"
        ref="emailRef"
        :pattern="emailReg"
        icon-left="reg-email"
        placeholder="Email"
        msg="Erro de e-mail"
      />
    </div> -->
    <div class="password">
      <AppInput
        v-model="fromData.password"
        ref="passwordRef"
        :pattern="passwordReg"
        placeholder="Senha (6-12 letras e números)"
        icon-left="key-gray"
        type="password"
        clearable
        msg="Senha (6-12 letras e números)"
      />
    </div>

    <div class="code">
      <AppInput
        v-model="fromData.captcha"
        ref="codeRef"
        :pattern="verifyCodeReg"
        placeholder="Código de verificação"
        msg="Erro no código de verificação"
        icon-left="reg-code"
        clearable
      >
        <template #right>
          <div :style="{ paddingRight: 'var(--app-px-18)' }">
            <img
              class="captcha"
              src=""
              alt=""
              ref="captchaRef"
              @click="changeCaptcha"
            />
            <!-- <AppButton
              :loading="codeLoading || emailCodeLoading"
              :disabled="enviarDisabled"
              @click="handleSendCode"
              fontSize="26"
              radius="46"
              whiteText
              yellowToRight
              bold
              width="130"
              height="46"
              center
              >{{ countdowm > 0 ? countdowm + "s" : "Enviar" }}
            </AppButton> -->
          </div>
        </template>
      </AppInput>
    </div>
    <AppButton
      @click="submit"
      :loading="registerLoading"
      class="submit"
      width="580"
      height="90"
      bold
      blue-to-right
      :radius="100"
      white-text
    >
      Register agora
    </AppButton>
    <div class="ly" @click="isCheckd = !isCheckd">
      <div class="radio">
        <AppImage
          :src="`/icons/${isCheckd ? 'i-radio-active' : 'i-radio-no'}.png`"
          alt=""
        />
      </div>
      <div class="scale">
        Eu concordo
        <div class="privacy" @click.stop="goPrivacy">
          com os termos e política de privacidade.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="app-login">
const router = useRouter();
const appStore = useAppStore();

const fromData = reactive({
  phone: "",
  password: "",
  captcha: "",
  confirm_phone: "",
  link_id: "",
  vid: "",
  // email: "",
  // code: "",
  // sid: "",
  // ts: "",
});
const { phoneReg } = useRegExpPhone();
// const emailRef = ref();
const phoneRef = ref();
const confirmPhoneRef = ref();
const passwordRef = ref();
const codeRef = ref();
const isCheckd = ref(true);
const captchaRef = ref();

// const changeRegType = (bool: boolean) => {
//   isPhone.value = bool;
//   fromData.code = "";
//   fromData.password = "";
// };

onMounted(() => {
  changeCaptcha();
});

const changeCaptcha = () => {
  getCaptcha().then((res: any) => {
    const base64String = arrayBufferToBase64(res.val);
    captchaRef.value.src = "data:image/png;base64," + base64String;
    fromData.vid = res.vid;
  });
};

const arrayBufferToBase64 = (arrayBuffer: any) => {
  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// const { run: runSendCode, loading: codeLoading } = useRequest(
//   () => ApiSendOfflineSms({ flag: "text", tel: fromData.phone, ty: 1 }),
//   {
//     manual: true,
//     onSuccess(data: string) {
//       const [sid, ts] = data.split(":");
//       fromData.sid = sid;
//       fromData.ts = ts;
//       startCountdown();
//       showToast("Código de verificação enviado");
//     },
//   }
// );

// 邮箱注册验证码获取
/* const { run: runEmailCode, loading: emailCodeLoading } = useRequest(
  () => ApiEmailCode({ ty: "1", mail: fromData.email }),
  {
    manual: true,
    onSuccess: (data) => {
      const [sid, ts] = data.split(":");
      fromData.sid = sid;
      fromData.ts = ts;
      startCountdown();
      showToast("Código de verificação enviado");
    },
  }
); */

/* const countdowm = ref(0);
const startCountdown = () => {
  countdowm.value = 60;
  const timer = setInterval(() => {
    countdowm.value--;
    sessionStorage.setItem("countdowm", countdowm.value.toString());
    if (countdowm.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
}; */

// 发送验证码按钮是否禁用
/* const enviarDisabled = computed(() => {
  return countdowm.value > 0;
}); */

const { run: runLogin } = useRequest(
  () =>
    ApiLogin({
      username: fromData.phone,
      password: fromData.password,
      device_no: "asdfasdf234",
    }),
  {
    manual: true,
    onSuccess(data) {
      openLoginDialog(false);
    },
  }
);

const { run: runRegister, loading: registerLoading } = useRequest(
  () =>
    ApiRegister({
      phone: fromData.phone,
      password: fromData.password,
      confirm_phone: fromData.confirm_phone,
      captcha: fromData.captcha,
      device_no: "asdfasdf234",
      link_id: fromData.link_id,
      vid: fromData.vid,
    }),
  {
    manual: true,
    onSuccess() {
      runLogin();
    },
  }
);

const submit = () => {
  phoneRef.value.validation();
  passwordRef.value.validation();
  codeRef.value.validation();
  confirmPhoneRef.value.validation();
  // 是否验证通过
  const isPass = [
    phoneRef.value.isValid,
    passwordRef.value.isValid,
    codeRef.value.isValid,
    confirmPhoneRef.value.isValid,
  ].every((item) => item);
  if (!isCheckd.value) {
    showToast("Por favor, leia e concorde com a Política de Privacidade");
    return;
  }
  if (isPass) {
    const obj = sessionStorage.getItem("LinkId");
    if (!!obj) {
      fromData.link_id = JSON.parse(obj).link_id;
    }
    runRegister();
    /*  if (!fromData.sid) {
      showToast("Por favor, envie o código de verificação");
    } else {
      const obj = sessionStorage.getItem("LinkId");
      if (!!obj) {
        fromData.link_id = JSON.parse(obj).link_id;
      }
      runRegister();
    } */
  }
};

/* const handleSendCode = () => {
  if (isPhone.value) {
    phoneRef.value.validation();
  } else {
    emailRef.value.validation();
  }
  const isPass = isPhone.value
    ? phoneRef.value.isValid
    : emailRef.value.isValid;
  if (isPass) {
    if (isPhone.value) {
      runSendCode();
    } else {
      runEmailCode();
    }
  }
}; */

const goPrivacy = () => {
  appStore.setLoginDialogVisible(false);
  router.push("/privacy");
};
</script>

<style lang="scss" scoped>
@import "../theme/mixin.scss";

.email,
.phone {
  // padding-top: 10px;
  padding-bottom: 40px;
}

.ly {
  color: #fff;
  padding: 36px 40px 25px 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  .radio {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 24px;

    img {
      width: 100%;
    }
  }

  .scale {
    font-size: 22px;
    line-height: 28px;

    .privacy {
      color: #0ed1f4;
      text-decoration: underline;
    }
  }
}

.password {
  padding-bottom: 40px;
}

.code {
  padding-bottom: 50px;
  .captcha {
    height: 50px;
    border-radius: 20px;
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
    background: linear-gradient(180deg, #044b9a 0%, #011a51 100%), #d9d9d9;
    box-shadow: 0px -3px 6px 0px rgba(255, 255, 255, 0.25) inset,
      0px -2px 3px 0px #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;

    &.active {
      background: linear-gradient(180deg, #ffd500 0%, #ff9901 100%),
        linear-gradient(180deg, #044b9a 0%, #011a51 100%), #d9d9d9;
    }

    .email {
      width: 100%;
      height: 100%;
      // background: url() no-repeat center center;
      @include webp("/icons/i-email.png");
      background-position: center center;
      background-size: 35px auto;

      &.active {
        // background: url() no-repeat center center;
        @include webp("/icons/i-email-active.png");
        background-position: center center;
        background-size: 35px auto;
      }
    }

    .phone {
      width: 100%;
      height: 100%;
      // background: url() no-repeat center center;
      @include webp("/icons/i-phone.png");
      background-position: center center;
      background-size: 25px auto;

      &.active {
        // background: url() no-repeat center center;
        @include webp("/icons/i-phone-active.png");
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
  border: 1px solid #0ed1f4;
  color: #0ed1f4;
  text-align: center;
  font-size: 26px;
  line-height: 46px;
}
</style>
