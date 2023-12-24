import type { AxiosRequestConfig } from 'axios'
import { murmurhash3_32_gc } from '~/utils/jq/murmurhash3';
import router from '~/router/index'

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? '' : '/api',
  timeout: 10000,
  responseType: 'arraybuffer',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'd': 25, // 24 web 25 h5  35 android 36 ios
  }
})

axiosInstance.interceptors.request.use((request) => {
  const appStore = useAppStore()
  const { token } = storeToRefs(appStore)
  const cborStr = cborEncrypt(request.data)
  const base64Str = arrayBufferToBase64(cborStr)
  const sign = murmurhash3_32_gc(base64Str, 24)
  request.headers['X-Ca-Timestamp'] = new Date().toDateString()
  request.headers['X-Ca-Nonce'] = sign

  if (token.value)
    request.headers['t'] = token.value

  request.data = cborStr
  return request
}, (error) => {
  return Promise.reject(error)
})

// // eslint-disable-next-line unused-imports/no-unused-vars
axiosInstance.interceptors.response.use(async (response) => {

  const appStore = useAppStore()
  const { language } = storeToRefs(appStore)

  if (response.headers['id'] && response.config.url === '/member/login') {
    appStore.setToken(response.headers['id'])
  }
  // const resData = cborDecrypt(response.data);
  // console.log(`响应数据：接口：${response.config.url}`, resData)

  let resData;
  if (response.headers['vid'] && response.config.url === '/member/captcha') {
    resData = {
      status: true,
      data: {
        val: response.data,
        vid: response.headers['vid'],
      }
    }
  } else {
    resData = cborDecrypt(response.data);
    // console.log(`响应数据：接口：${response.config.url}`, resData)
  }

  if (!resData.status) {
    // 状态是false
    if (resData.data === 'token') {
      appStore.clearToken()
      if (!appStore.isApp) {
        router.replace('/')
        openLoginDialog()
      }
      return
    }

    if (!isNaN(Number(resData.data))) {
      const key = resData.data
      if (key) {
        // @ts-ignore
        const toastMessage = key && errorJson[key] ? errorJson[key][language.value] : 'erro desconhecido'
        showToast({
          message: toastMessage,
          wordBreak: 'break-word',
        })
      }
    }
    return Promise.reject(resData);
  }
  else {
    return resData.data
  }
}, (error) => {
  return Promise.reject(error)
})

export async function request<T>(config: AxiosRequestConfig & { noToast?: boolean }) {
  return axiosInstance.request<T, T>(config)
}

export default request
