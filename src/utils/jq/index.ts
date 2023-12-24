
/**
 * 获取服务器时间
 * @param url 请求地址, 不传递，使用location.oright + '/date'
 * @returns {Promise<string>}
 */
export function setServerTime(url?: string): Promise<string> {
  const _url = url || location.origin + '/date'
  return new Promise((resolve) => {
    const xhr: any = new XMLHttpRequest()
    xhr.open('head', _url, true)
    xhr.send(null)
    xhr.timeout = 15000
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const serverDateStr = xhr.getResponseHeader('Date')
        // 1，相对于服务器的本地时间
        const serverDate: Date = new Date(serverDateStr)
        const now = new Date().getTime()
        const offsetTime = serverDate.getTime() - now
        const localTime = new Date(new Date().getTime() + offsetTime)
        localStorage.setItem('__serverTime', localTime.toUTCString())
        resolve(localTime.toUTCString())
      }
    }
  })
}

/**
 * 获取服务器时间，先获取localStorage.getItem('__serverTime')，没有获取到，调用setServerTime
 * @returns {Promise<string>}
 */
export function getServerTime(url?: string): Promise<string> {
  return new Promise((resolve) => {
    const serverTime = localStorage.getItem('__serverTime')
    if (serverTime) {
      resolve(serverTime)
    } else {
      setServerTime(url).then((time) => {
        resolve(time)
      })
    }
  })
}