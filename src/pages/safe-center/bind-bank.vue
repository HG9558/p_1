<template>
  <div class="bind-bank">
    <AppHeader left-arrow title="Número da conta bancária" placeholder />
    <section class="content">
      <h3>Nome completo: {{ userInfo.username }}</h3>
      <div class="info-bar mb-34">
        <label>Nome do usuário:</label>
        <AppInput
          ref="realNameRef"
          v-model="formdata.realname"
          plain
          align="right"
          width="auto"
          placeholder="Insira o nome do titular do cartão"
          msg="Insira o nome do titular do cartão"
          required
        />
      </div>
      <div class="divider"></div>

      <div class="info-bar mb-34">
        <label>Código CPF:</label>
        <AppInput
          ref="pixIdRef"
          v-model="formdata.pix_id"
          plain
          placeholder="Insira o seu código CPF"
          width="auto"
          msg="Informe o CPF no formato correto"
          required
          type="number"
          clearable
        />
      </div>

      <!-- <div class="divider"></div>
      <div class="info-bar mb-34" @click="toggleSelect">
        <label>Tipo Pix:</label>
        <div class="unit-input">
          <span class="unit">{{ currentFlag }}</span>
          <AppImage class="arrow-down" src="/icons/i-arrow-white-down.png" />
        </div>
        <AppSelect
          ref="selectRef"
          v-model="formdata.flag"
          :list-data="flagList"
          plain
        />
      </div> -->

      <div class="divider"></div>
      <div class="info-bar mb-34">
        <label>{{ currentFlag }}</label>
        <AppInput
          ref="cpfidRef"
          v-model="formdata.pix_account"
          :key="formdata.flag"
          plain
          align="right"
          width="auto"
          :placeholder="currentFlagMap.placeholder"
          :msg="currentFlagMap.errorMsg"
          required
          :type="accountType"
          clearable
        />
      </div>
      <div class="divider"></div>
      <!-- <AppInput
        v-model="code"
        ref="codeRef"
        :pattern="verifyCodeReg"
        placeholder="por favor insira o código de verificação"
        msg="Erro no código de verificação"
        icon-left="reg-code"
        clearable
        width="710"
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
      </AppInput> -->
      <div class="btn-box">
        <AppButton
          :loading="bindLoading"
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
      <div class="divider"></div>
    </section>
  </div>
</template>

<script lang="ts" setup name="BindBank">
const router = useRouter();
const appStore = useAppStore();
const { userInfo } = storeToRefs(appStore);

const formdata = reactive({
  pix_id: "",
  flag: "1",
  realname: "",
  pix_account: "",
});
const pixIdRef = ref();
const realNameRef = ref();
const cpfidRef = ref();
/* const selectRef = ref();
const codeRef = ref(); */

const flagList = [
  { label: "CPF", value: "1" },
  { label: "Telefone(+55)", value: "2" },
  { label: "E-mail", value: "3" },
];
const currentFlag = computed(
  () => flagList.find((a) => a.value === formdata.flag)?.label
);
const currentFlagMap = computed(() => {
  const obj = {
    placeholder: "",
    errorMsg: "",
  };
  switch (formdata.flag) {
    case "1":
      obj.placeholder = "CPF";
      obj.errorMsg = "Informe o CPF no formato correto";
      break;
    case "2":
      obj.placeholder = "Telefone(+55)";
      obj.errorMsg = "Adicione o número do celular";
      break;
    case "3":
      obj.placeholder = "E-mail";
      obj.errorMsg = "Por favor, preencha o e-mail";
      break;
  }
  return obj;
});
/* const toggleSelect = () => {
  selectRef.value.btnClick();
}; */
const accountType = computed(() =>
  formdata.flag === "3" ? "email" : "number"
);

const { run: runBindBank, loading: bindLoading } = useRequest(
  () =>
    ApiBindBank({
      flag: formdata.flag,
      pix_id: formdata.pix_id,
      realname: formdata.realname,
      pix_account: formdata.pix_account,
      sid: sidData.sid,
      ts: sidData.ts,
      code: "123",
      ty: 1,
      // ty:
      //   userInfo.value.phone_verify && +userInfo.value.phone_verify === 1
      //     ? 1
      //     : 2,
    }),
  {
    manual: true,
    onSuccess: () => {
      appStore.runGetUserBanks();
      router.go(-1);
    },
  }
);

const confirmFn = () => {
  if (
    realNameRef.value.validation() &&
    pixIdRef.value.validation() &&
    cpfidRef.value.validation() /* &&
    codeRef.value.validation() */
  ) {
    // if (sidData.sid === "") {
    //   showToast("Por favor, envie o código de verificação");
    //   return;
    // }
    runBindBank();
  }
};

// const code = ref("");
const sidData = reactive({
  sid: "",
  ts: "",
});

// const countdowm = ref(0);
/* const startCountdown = () => {
  countdowm.value = 300;
  const timer = setInterval(() => {
    countdowm.value--;
    sessionStorage.setItem("countdowm", countdowm.value.toString());
    if (countdowm.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
}; */

/* const dealSid = (data: string) => {
  const [sid, ts] = data.split(":");
  sidData.sid = sid;
  sidData.ts = ts;
  startCountdown();
  showToast("Código de verificação enviado");
};
 */
/* const hasPhone = computed(
  () =>
    userInfo.value &&
    userInfo.value.phone_verify &&
    +userInfo.value.phone_verify === 1
); */

/* const handleSendCode = () => {
  if (hasPhone.value) {
    runGetPhoneCode();
  } else {
    runGetEmailCode();
  }
}; */

/* const { run: runGetPhoneCode, loading: codeLoading } = useRequest(
  () => ApiOnlinePhoneCode({ ty: 3 }),
  {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        dealSid(data);
      }
    },
  }
); */

/* const { run: runGetEmailCode, loading: emailCodeLoading } = useRequest(
  () => ApiOnlineEmailCode({ ty: 3 }),
  {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        dealSid(data);
      }
    },
  }
); */
</script>

<style lang="scss" scoped>
.info-bar {
  width: 710px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
  line-height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 24px;
  position: relative;

  label {
    color: #fff;
    font-size: 28px;
    white-space: nowrap;
    width: 250px;
  }

  .app-input-outer {
    flex: 1;
  }

  .unit-input {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .unit {
      padding-left: 20px;
      color: #fff;
      font-size: 28px;
    }
  }

  .info-title {
    color: #fff;
    font-size: 28px;
  }

  .arrow-down {
    width: 20px;
    margin-left: 20px;
  }
}

.fake-select {
  width: 710px;
  line-height: 72px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
  color: rgba(255, 255, 255, 0.4);
  font-size: 28px;
  font-weight: 400;
  padding-left: 32px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    width: 16px;
  }
}

.btn-box {
  padding-top: 36px;
}

.divider {
  height: 34px;
}

.bind-bank {
  .content {
    margin: 0 auto;
    width: 710px;

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
