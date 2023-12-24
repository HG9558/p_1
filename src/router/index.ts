import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

// 路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: "instant", };
  }
})
router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  appStore.isApp = to.query['is-app'] === '1'

  if (to.query.t) {
    appStore.setToken(to.query.t.toString())
  }

  // 注册链接打开弹窗
  if (to.path === '/register') {
    sessionStorage.setItem('LinkId', JSON.stringify(to.query))
    openRegisterDialog()
    next('/')
    return
  }


  // 未登录，路由需要权限，跳转到登录页
  if (to.meta.auth && !appStore.isLogin) {
    openLoginDialog()
  } else {
    next()
  }
})
router.afterEach(() => {
  setTimeout(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, 0);
})

export default router
