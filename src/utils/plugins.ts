// 在此处注册实例指令或者方法
function install(Vue: ReturnType<typeof import('vue').createApp>) {
    const prototype = Vue.config.globalProperties;
    prototype.$toPx = function (num: number) {
        return `var(--app-px-${num})`
    }
}
declare module 'vue' {
    interface ComponentCustomProperties {
        $toPx(num: number): string
    }
}
export default install;