import { showDialog } from "vant";

export const openLoginDialog = (bool = true) => {
  const appStore = useAppStore();
  appStore.setLoginDialogVisible(bool);
}

export const openRegisterDialog = (bool = true) => {
  const appStore = useAppStore();
  appStore.setRegisterDialogVisible(bool);
}

export const openFindPasswordDialog = (bool = true) => {
  const appStore = useAppStore();
  appStore.setFindPasswordDialogVisible(bool);
}

export const isFullPath = (s: string) => {
  return s.indexOf('http://') !== -1 || s.indexOf('https://') !== -1;
}

export const brazilImg = 'https://cfs31008.lbet89.com'

// 登录接口错误处理

export const DealLoginError = (data: any) => {
  const datas = data.split('|');
  if (datas[0] === 'password') {
    showDialog({
      className: 'deep-dialog',
      title: 'OBSERVAÇÃO',
      message: `Senha digitada incorretamente ${datas[1]} vezes`,
    })
    // Dialog.showDialog({
    //   template: 'tmp2',
    //   title: 'LƯU Ý',
    //   confirmText: 'TÔI ĐÃ HIỂU',
    //   footerButSizi: true,
    //   btns: 1,
    //   customComponent: ErrorLogin,
    //   props: {
    //     type: 'error',
    //     num: datas[1]
    //   },
    //   footerText: 'Quên Mật Khẩu?'
    // });
  } else if (data === '1006') {
    // showDialog({
    //   title: 'OBSERVAÇÃO',

    // })
    // Dialog.showDialog({
    //   template: 'tmp2',
    //   title: 'LƯU Ý',
    //   confirmText: 'Tôi Đã Hiểu',
    //   footerButSizi: true,
    //   btns: 1,
    //   customComponent: ErrorLogin,
    //   props: {
    //     num: datas[1],
    //     type: 'kefu'
    //   }
    // });
  } else if (datas[0] === '1330') {
    // Dialog.showDialog({
    //   template: 'tmp1',
    //   title: 'LƯU Ý',
    //   confirmText: 'CSKH',
    //   cancelText: 'TÔI ĐÃ HIỂU',
    //   tmp1Content: datas[1],
    //   btns: 2,
    //   onOk: () => {
    //     goToServeUrl();
    //   }
    // });
  }
};
