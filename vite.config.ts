import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ImportMetaEnvPlugin from '@import-meta-env/unplugin'

import path from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'

import Unocss from 'unocss/vite'
import vitePluginCompression from 'vite-plugin-compression'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'vite-plugin-vue-markdown'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Inspector from 'vite-plugin-vue-inspector'
import banner from 'vite-plugin-banner'
import replace from '@rollup/plugin-replace'

import pkg from './package.json'
import dayjs from 'dayjs'

/**
 * @type {import('vite').UserConfig}
 */
export default ({ mode }: ConfigEnv): UserConfig => {
  const buildDate = new Date().toLocaleString()

  Object.assign(process.env, loadEnv(mode, process.cwd()))

  const env = loadEnv(mode, process.cwd())

  const { VITE_PORT, VITE_BASE_URL, VITE_COPYRIGHT } = env

  console.log('Current config:', env)

  return {
    base: VITE_BASE_URL,

    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname)}/`,
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [
      replace({
        preventAssignment: true,
        __BUILD_DATE__: dayjs().format('DD MMM YYYY HH:mm:ss'),
      }),

      Vue({
        include: [/\.vue$/, /\.md$/],
        reactivityTransform: true,
        template: {
          compilerOptions: {
            // isCustomElement: (tag) => tag.startsWith('custom-'),
            // isCustomElement: (tag) => tag === 'custom-mediatype-buttons',
          },
        },
      }),

      // https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx
      vueJsx({}),

      // https://github.com/mdit-vue/vite-plugin-vue-markdown
      Markdown({
        headEnabled: true,

        // https://markdown-it.github.io/markdown-it/
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
        },

        // Class names for the wrapper div
        wrapperClasses: 'markdown-body',
      }),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),

      vitePluginCompression({
        threshold: 1024 * 10,
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        // targets to transform
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: [
          'vue',
          'vue-router',
          {
            axios: [['default', 'axios']],
          },
        ],
        resolvers: [NaiveUiResolver()],
        dts: 'src/autogen-import.d.ts',
        exclude: ['**/dist/**'],
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: 'src/autogen-components.d.ts',
        extensions: ['vue', 'md', 'svg'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [NaiveUiResolver()],
        types: [
          {
            from: 'vue-router',
            names: ['RouterLink', 'RouterView'],
          },
        ],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
      }),

      // https://github.com/iendeavor/import-meta-env/tree/main/packages/examples/vite-starter-example
      ImportMetaEnvPlugin.vite({
        example: '.env.example',
        // https://github.com/iendeavor/import-meta-env/issues/95
        // shouldInlineEnv: process.env.IMPORT_META_ENV_MODE === 'production',
      }),

      // https://github.com/webfansplz/vite-plugin-vue-inspector
      Inspector({
        enabled: false,
        toggleButtonVisibility: 'always', // 'always' | 'active' | 'never',
        toggleButtonPos: 'bottom-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
      }),

      // https://www.npmjs.com/package/vite-plugin-banner
      banner(
        `/**\n * name: ${pkg.name}\n * version: v${pkg.version}\n * build date: ${buildDate}\n * copyright: ${VITE_COPYRIGHT}\n * description: ${pkg.description}\n * author: ${pkg.author.name}\n * homepage: ${pkg.homepage}\n */`
      ),

      // https://github.com/antfu/unocss
      Unocss(),
    ],

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "./src/styles/variables.scss" as *;',
        },
      },
    },

    server: {
      host: true,
      port: Number(VITE_PORT),
    },

    preview: {
      host: '0.0.0.0',
      port: Number(VITE_PORT),
      strictPort: true,
    },

    optimizeDeps: {
      include: [
        'vue',
        '@vue-flow/core',
        '@lljj/vue3-form-naive',
        '@vueuse/integrations/useAxios',
        '@vueuse/integrations/useJwt',
        '@vueuse/head',
        'dayjs',
        'dayjs/plugin/relativeTime.js',
        'lodash',
        'naive-ui',
        'vite-plugin-vue-markdown',
        'uuid',
        'vue-icomoon',
        'vue-dataset',
        'handlebars',
        'makerjs',
      ],
      exclude: ['vue-demi'],
    },

    build: {
      minify: false,
      emptyOutDir: false,
      chunkSizeWarningLimit: 4000,
      sourcemap: false,
      rollupOptions: {
        // external: ['vanilla-jsoneditor'],
        output: {
          // Provide global variables to use in the UMD build
          globals: {
            'vanilla-jsoneditor': 'JSONEditor',
          },
        },
      },
    },

    define: {
      __BUILD_DATE: JSON.stringify(buildDate),
      'process.env': process.env,
      'process.cwd': process.cwd,
    },
  }
}
