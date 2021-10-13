const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const webpack = require('webpack')
const TransformPages = require('uni-read-pages')

module.exports = {
  lintOnSave: false,
  publicPath: './',
  chainWebpack: (config) => {
    config.resolve.alias.set('@app', resolve('src'))
    config.resolve.alias.set('@api', resolve('src/api'))
    // config.module
    //   .rule('page')
    //   .enforce('pre')
    //   .test(/\.vue$/)
    //   .use('addMeta')
    //   .loader(resolve('loader/addMeta.loader.js')).end
    config.module.rule('md').test(/\.md$/).use('text-loader').loader('text-loader').end
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        app: resolve('src/utils/__provider'),
      }),
      require('unplugin-vue2-script-setup/webpack')({}),
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ['path', 'name', 'style'],
          })
          return JSON.stringify(tfPages.routes)
        }, true),
      }),
      // require('unplugin-auto-import/webpack')({
      //   include: [
      //     /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      //     /\.vue\??/, // .vue
      //   ],
      //   imports: [
      //     '@vue/composition-api',
      //     // 'vue-router',
      //     // custom
      //     // {
      //     //   '@vueuse/core': ['useMouse'],
      //     //   '[package-name]': [
      //     //     '[import-names]',
      //     //     // alias
      //     //     ['[from]', '[alias]'],
      //     //   ],
      //     // },
      //   ],

      //   // custom resolvers
      //   // see https://github.com/antfu/unplugin-auto-import/pull/23/
      //   resolvers: [],
      // }),
    ],
  },
}
