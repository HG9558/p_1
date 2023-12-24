<script lang="ts" setup name="ResetPwd">
// const countdowm = ref(0);

const oldPwdRef = ref()
const newPwdRef = ref()
const renewPwdRef = ref()

const formdata = reactive({
  old_password: '',
  password: '',
  confirm_password: '',
})

const renewPwdChange = (v: any) => {
  newPwdRef.value?.validation()
}

const { run: runUpdatePwd, loading } = useRequest(() => ApiUpdateLoginPwd(formdata), {
  manual: true,
  onSuccess: () => {
    localStorage.clear()
    location.replace(location.origin)
  }
})

const confirmFn = () => {
  if (oldPwdRef.value.validation() && newPwdRef.value.validation() && renewPwdRef.value.validation()) {
    runUpdatePwd()
  }
}

</script>

<template>
  <div class="reset-pwd">
    <AppHeader left-arrow title="Alterar senha de entrar" placeholder />
    <section class="content">
      <AppInput
        ref="oldPwdRef"
        v-model="formdata.old_password"
        :pattern="passwordReg"
        msg="Senha (6-12 letras e números)"
        placeholder="Senha (6-12 letras e números)"
        icon-left="i-pwd"
        width="710"
        type="password"
        :style-obj="{
          borderRadius: 'var(--app-px-8)',
          background:
            'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
          border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
        }"
      />
      <div class="divider"></div>
      <AppInput
        ref="newPwdRef"
        v-model="formdata.password"
        :pattern="passwordReg"
        msg="Senha (6-12 letras e números)"
        placeholder="Por favor insira uma nova senha"
        icon-left="i-new-pwd"
        width="710"
        type="password"
        :style-obj="{
          borderRadius: 'var(--app-px-8)',
          background:
            'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
          border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
        }"
      />
      <div class="divider"></div>
      <AppInput
        ref="renewPwdRef"
        v-model="formdata.confirm_password"
        placeholder="Confirme a nova senha"
        icon-left="i-renew-pwd"
        width="710"
        type="password"
        :rules="[
          { pattern: passwordReg, msg: 'Senha (8-20 letras e números)' },
          { validator: (val: any) => val === formdata.password, msg: 'A nova senha e a senha de confirmação devem ser iguais' }
        ]"
        :style-obj="{
          borderRadius: 'var(--app-px-8)',
          background:
            'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
          border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
        }"
        @change="renewPwdChange"
      />
      <!-- <div class="divider"></div>
      <AppInput
        ref="codeRef"
        :pattern="verifyCodeReg"
        placeholder="Código de verificação"
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
              @click=""
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
      <div class="desc">
        * Insira 8 - 20 caracteres alfanuméricos. não diferencia maiúsculas de
        minúsculas. (caracteres chineses não permitidos)
      </div>
      <div class="btn-box">
        <AppButton
          :loading="loading"
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
.desc {
  color: #fff;
  font-size: 26px;
  font-weight: 400;
  line-height: 40px;
  padding: 32px 24px;
}
.btn-box {
  // padding-top: 28px;
}
.divider {
  height: 34px;
}
.reset-pwd {
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
