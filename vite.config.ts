/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import postcsspxtoviewport from 'postcss-px-to-viewport'
import Layouts from 'vite-plugin-vue-layouts'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // eslint-disable-next-line n/prefer-global/process
  const root = process.cwd()
  const { VITE_DROP_CONSOLE, VITE_SOURCE_MAP, VITE_DROP_DEBUGGER } = loadEnv(mode, root) as Record<string, string>

  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    define: {
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
      __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      __VUE_I18N_PROD_DEVTOOLS__: JSON.stringify(false),
    },
    plugins: [
      vueSetupExtend(),
      VueMacros({
        defineOptions: false,
        defineModels: false,
        plugins: {
          vue: Vue({
            script: {
              propsDestructure: true,
              defineModel: true,
            },
          }),
        },
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages(),

      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
          'pinia',
          {
            'axios': [[
              'default', 'axios',
            ]],
            'vue-i18n': [
              'createI18n', 'useI18n',
            ],
            'vue-request': ['useRequest'],
            'vant': ['showToast'],
            'cg-utils': [
              'setUtilsConfig',
              'timestamp2Date',
              'cborEncrypt',
              'cborDecrypt',
              'add',
              'subtract',
              'multiply',
              'divide',
              'SocketSingleton',
              'deleteEmptyValue',
              'setXxetaConfig',
              'setAxiosUrlRval',
              'setHtmlPictureCompatilble',
              'getPictureSuffix',
            ],
            'dayjs': [[
              'default', 'dayjs',
            ]],
            'clipboard': ['copy'],
          },
        ],
        dts: true,
        dirs: [
          './src/composables/*',
          './src/stores',
          './src/core/http',
          './src/lang',
          './src/utils',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true,
        resolvers: [VantResolver()],
      }),
    ],

    css: {
      postcss: {
        plugins: [
          postcsspxtoviewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 750, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: [], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
            landscape: false, // 是否处理横屏情况
          }),
        ],
      },
    },
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          target: 'https://h5.cyestari.com', // 正式环境
          rewrite(url: string) {
            return url.replace(/^\/api/, '')
          },
          ws: true,
        },
      },
    },
    build: {
      minify: 'terser',
      assetsInlineLimit: 0,
      sourcemap: VITE_SOURCE_MAP === 'true',
      terserOptions: {
        compress: {
          drop_console: VITE_DROP_CONSOLE === 'true',
          drop_debugger: VITE_DROP_DEBUGGER === 'true',
        },
      },
    },
  }
})
