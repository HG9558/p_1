/**
 *
 * 切换主题
 * @param {Themes} theme
 */
export function toggleTheme(theme: Themes) {
  const html = document.documentElement
  html.setAttribute('theme', theme)
}

/**
 * 判断值是否空
 */
export function isVEmpty(value: any) {
  return value === '' || value === undefined || value === null
}
export const openLink = (src: string, type: "_blank" | "_self" = "_self") => {
  // 请不要新窗口打开(百度,夸克,ios桌面快捷方式有兼容性问题)
  window.open(src, type);
};

// 保留2位小数
export function toDecimal(value: string | number, decimal = 2) {
  const originStr = value?.toString()

  if (!originStr || Number.isNaN(Number(originStr)) || originStr === '0') return decimal === 2 ? '0.00' : '0'

  const arr = originStr.split('.')
  if (decimal === 0) return arr[0]
  if (arr.length === 1) return arr[0] + '.00'

  const integerPart = arr[0]
  const decimalPart = arr[1]
  return integerPart + '.' + decimalPart.slice(0, decimal).padEnd(decimal, '0')
}
// 状态转颜色
export function colorFilter(state: number) {
  if ([2].includes(state)) {
    // 黄色
    return '#F89F03';
  } else if ([1].includes(state)) {
    // 绿色
    return '#5DDB1C';
  } else if ([3].includes(state)) {
    // 红色
    return '#E70B0B';
  }
}
// 状态
export function stateFilter(state: number) {
  if ([2].includes(state)) {
    // 黄色
    return 'Esperando';
  } else if ([1].includes(state)) {
    // 绿色
    return 'Sucesso';
  } else if ([3].includes(state)) {
    // 红色
    return 'Falhar';
  }
}

export function getBrowser() {
  const UserAgent: any = navigator.userAgent.toLowerCase();
  const browserInfo: any = {};
  const browserArray: any = {
    IE: 'ActiveXObject' in window, // IE
    Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
    Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
    Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
    Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') === -1, // safari浏览器
    Edge: UserAgent.lastIndexOf('edg') > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(UserAgent) // 微信浏览器
  };
  let versions = '';
  for (const i in browserArray) {
    if (browserArray[i]) {
      if (i === 'IE') {
        const match = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/);
        versions = match ? match[2] : '9.2';
        browserInfo.type = 'IE';
      } else if (i === 'Chrome') {
        const match = UserAgent.match(/chrome\/([\d.]+)/);
        browserInfo.type = 'Chrome';
        versions = match ? match[1] : '88.2.2';
      } else if (i === 'Firefox') {
        const match = UserAgent.match(/firefox\/([\d.]+)/);
        browserInfo.type = 'Firefox';
        versions = match ? match[1] : '99.2.3';
      } else if (i === 'Opera') {
        const match = UserAgent.match(/opera\/([\d.]+)/);
        browserInfo.type = 'Opera';
        versions = match ? match[1] : '89.43.3';
      } else if (i === 'Safari') {
        const match = UserAgent.match(/version\/([\d.]+).*/);
        browserInfo.type = 'Safari';
        versions = match ? match[1] : '7.3.4';
      } else if (i === 'Edge') {
        const match = UserAgent.match(/edg\/([\d.]+)/);
        browserInfo.type = 'Edge';
        versions = match ? match[1] : '32.34';
      }
    }
  }

  browserInfo.browser_version = Number(versions.split('.')[0]);
  browserInfo.mobile = !!UserAgent.match(/applewebkit.*mobile.*/) ? 'mobile' : 'pc'; // 是否为移动终端
  browserInfo.isIos =
    !!UserAgent.match(/\(i[^;]+;( u;)? cpu.+mac os x/) || UserAgent.indexOf('intel mac os') > -1;

  return browserInfo;
}
