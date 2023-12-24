import { createApp } from 'vue'
import { setToastDefaultOptions, Lazyload, Locale } from 'vant'
import router from '~/router/index'
import App from './App.vue'
import i18n from './lang'
import plugins from './utils/plugins'

import 'normalize.css'
import 'vant/lib/index.css';
import './theme/index.scss'

// 引入英文语言包
import ptBR from 'vant/es/locale/lang/pt-BR';

Locale.use('pt-BR', ptBR);

setHtmlPictureCompatilble()
setUtilsConfig({
  timezone: 'America/Sao_Paulo',
  // format: 'DD.MM HH:mm',
  format: 'YYYY-MM-DD HH:mm:ss', // 不知道到底用哪一种
})
setToastDefaultOptions({ duration: 2000, className: 'cg-toast' });

const app = createApp(App)

app.use(Lazyload).use(i18n).use(createPinia()).use(router).use(plugins)
app.mount('#app')
