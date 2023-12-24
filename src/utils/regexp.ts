export function useRegExpUserName() {
  const appStore = useAppStore();
  const { language } = storeToRefs(appStore);
  const reg = computed(() => {
    switch (language.value) {
      case Languages.EN_US:
        return /^[a-z]{1,9}$/;
      case Languages.PT_BR:
        return /^[0-9]{1,9}$/;
      default:
        return /./;
    }
  })
  h
  return {
    userNameReg: reg
  }
}

export function useRegExpPhone() {
  const appStore = useAppStore();
  const { language } = storeToRefs(appStore);
  const reg = computed(() => {
    switch (language.value) {
      case Languages.EN_US:
        return /^[0-9]{6,12}$/;
      case Languages.PT_BR:
        return /^[0-9]{6,12}$/;
      default:
        return /./;
    }
  })
  return {
    phoneReg: reg
  }
}

// 邮箱
export const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// 密码(6-12位字母、数字)
export const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/

// 支付密码(6位纯数字)
export const payPasswordReg = /^[0-9]{6}$/

// 验证码(任意4位数字)
export const verifyCodeReg = /^[a-zA-Z0-9]{4}$/;

// 任意金额
export const amountReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
