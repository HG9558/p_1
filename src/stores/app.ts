import i18n from "~/lang"

export const useAppStore = defineStore('app', () => {
  const language = ref(Languages.PT_BR)
  const loginDialogVisible = ref(false)
  const loginDialogType = ref('login')
  const registerDialogVisible = ref(false)
  const findPasswordDialogVisible = ref(false)
  const editAvatarDialogVisble = ref(false)
  const token = ref(localStorage.getItem('t') || '');
  const isLogin = computed(() => token.value ? true : false)
  const isApp = ref(false) // 是否App引用

  // 用户信息
  const { run: runGetMemberInfo, data: memberInfoData, loading: loadingUserinfo } = useRequest(ApiGetMemberInfo, {
    ready: isLogin,
    onSuccess: () => {
      runGetUserBalance()
      runDepositBonusConf()
      runGetBalanceDetail()
      runGetWithdrawConf()
      runGetUserBanks()
    },
    onError: (err) => {
      console.error('获取用户信息失败', err)
      clearToken();
    }
  })

  const { run: runGetUserBalance, data: userBalance, loading: loadingBalance } = useRequest(ApiGetUserBalance, {
    manual: true,
    onError: (err) => {
      console.error('获取用户余额信息失败', err)
    }
  })

  const { run: runGetBalanceDetail, data: balanceDetailInfo } = useRequest(ApiBalanceDetailInfo, {
    manual: true,
  })

  const { run: runDepositBonusConf, data: depositBonusConf } = useRequest(() => ApiDepositBonusConf({ ty: depositTy.value }), {
    manual: true,
  })

  const { run: runGetWithdrawConf, data: withdrawConf } = useRequest(ApiGetWithdrawConf, {
    manual: true,
  })


  const userBanks = ref<any[]>([])
  const { run: runGetUserBanks } = useRequest(ApiBankList, {
    manual: true,
    onSuccess: (data) => {
      if (data && data.d && data.d.length) {
        userBanks.value = data.d
      } else {
        userBanks.value = []
      }
    }
  })

  const { data: custService } = useRequest(ApiGetFBTG)

  // 首存 次存 判断
  const depositTy = computed(() => {
    if (userInfo.value.deposit_amount) {
      return 2
    } else {
      return 1
    }
  })

  const userInfo = computed(() => {
    return {
      ...memberInfoData.value,
      ...userBalance.value,
      formatAmount: UsAmountFormat(userBalance.value?.brl || 0),
      balanceDetailInfo: balanceDetailInfo.value,
    }
  })

  // 设置语言
  const setLanguage = (lang: typeof Languages[keyof typeof Languages]) => {
    console.log(i18n.global.locale, lang)
    language.value = lang
    // i18n.global.locale.value = lang
    i18n.global.locale = lang
  }

  // 设置loginDialogVisible
  const setLoginDialogVisible = (visible: boolean) => {
    loginDialogType.value = 'login'
    loginDialogVisible.value = visible
  }

  // 设置注册弹窗
  const setRegisterDialogVisible = (visible: boolean) => {
    loginDialogType.value = 'register'
    loginDialogVisible.value = visible
  }

  // 设置findPasswordDialogVisible
  const setFindPasswordDialogVisible = (visible: boolean) => {
    findPasswordDialogVisible.value = visible
  }

  // 设置editAvatarDialogVisble
  const setEditAvatarDialogVisble = (visible: boolean) => {
    editAvatarDialogVisble.value = visible
  }

  // 设置token
  const setToken = (t: string) => {
    localStorage.setItem('t', t)
    token.value = t
  }

  // 清除token
  const clearToken = () => {
    localStorage.removeItem('t')
    token.value = ''
  }

  return {
    isLogin,
    userInfo,
    depositTy,
    token,
    language,
    setLanguage,
    loginDialogVisible,
    loginDialogType,
    setLoginDialogVisible,
    registerDialogVisible,
    setRegisterDialogVisible,
    findPasswordDialogVisible,
    setFindPasswordDialogVisible,
    editAvatarDialogVisble,
    setEditAvatarDialogVisble,
    setToken,
    clearToken,
    runGetMemberInfo,
    runGetUserBalance,
    loadingBalance,
    loadingUserinfo,
    isApp,
    depositBonusConf,
    runGetBalanceDetail,
    balanceDetailInfo,
    runGetWithdrawConf,
    withdrawConf,
    custService,
    userBanks,
    runGetUserBanks,
  }
})
