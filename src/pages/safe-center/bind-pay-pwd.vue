<script lang="ts" setup name="BindPayPwd">
import { showFailToast } from 'vant'

// const countdowm = ref(0);

const router = useRouter()

const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)

const oldPwdRef = ref()
const newPwdRef = ref()
const renewPwdRef = ref()

const hasPayPwd = computed(() => userInfo.value && userInfo.value.pay_password && +userInfo.value.pay_password === 1)

const formdata = reactive({
  oldPwd: '',
  newPwd: '',
  renewPwd: '',
})

const confirmFn = () => {
  if (hasPayPwd.value && !oldPwdRef.value.validation()) {
    showFailToast('Digite a senha de pagamento antiga')
    return
  }
  if (formdata.newPwd.trim() !== formdata.renewPwd.trim()) {
    showFailToast('A nova senha e a senha de confirmação devem ser iguais')
    return
  }
  if (newPwdRef.value.validation() && renewPwdRef.value.validation()) {
    router.push({ path: '/safe-center/verify-code', state: { payPwd: formdata.newPwd, oldPayPwd: formdata.oldPwd }, query: { type: 'paypwd' } })
  }
}

const renewPwdChange = (v: any) => {
  newPwdRef.value?.validation()
}

</script>

<template>
  <div class="bind-pay-pwd">
    <AppHeader left-arrow title="Senha de pagamento" placeholder />
    <section class="content">
      <template v-if="hasPayPwd">
        <AppInput
          ref="oldPwdRef"
          v-model="formdata.oldPwd"
          :pattern="payPasswordReg"
          msg="Senha (6 letras e números)"
          placeholder="Digite sua senha atual."
          icon-left="i-pwd"
          width="710"
          type="password"
          err-height="34"
          :max-length="6"
          clearable
          :style-obj="{
            borderRadius: 'var(--app-px-8)',
            background:
              'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
            border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
          }"
        />
        <div class="divider"></div>
      </template>
      <AppInput
        ref="newPwdRef"
        v-model="formdata.newPwd"
        placeholder="Por favor insira uma nova senha"
        icon-left="i-new-pwd"
        width="710"
        type="password"
        err-height="34"
        :max-length="6"
        clearable
        :rules="[
          { pattern: payPasswordReg, msg: 'Senha (6 letras e números)' },
          // { validator: (val: any) => val === formdata.renewPwd, msg: 'A nova senha e a senha de confirmação devem ser iguais' }
        ]"
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
        v-model="formdata.renewPwd"
        :rules="[
          { pattern: payPasswordReg, msg: 'Senha (6 letras e números)' },
          { validator: (val: any) => val === formdata.newPwd, msg: 'A nova senha e a senha de confirmação devem ser iguais' }
        ]"
        placeholder="Confirme a nova senha"
        icon-left="i-renew-pwd"
        width="710"
        type="password"
        err-height="34"
        :max-length="6"
        clearable
        :style-obj="{
          borderRadius: 'var(--app-px-8)',
          background:
            'linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E',
          border: 'var(--app-px-1) solid rgba(255, 255, 255, 0.10)',
        }"
        @change="renewPwdChange"
      />
      <div class="divider"></div>
      <!-- <AppInput
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
        * Insira 6 números. não diferencia maiúsculas de
        minúsculas. (caracteres chineses não permitidos)
      </div>
      <div class="btn-box">
        <AppButton
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
.bind-pay-pwd {
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
