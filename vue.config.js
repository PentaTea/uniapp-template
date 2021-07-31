const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const webpack = require('webpack')

module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@app', resolve('src'))
    config.resolve.alias.set('@api', resolve('src/api'))

    // //全局添加 scss
    // const oneOfsMap = config.module.rule('scss').oneOfs.store
    // oneOfsMap.forEach(item => {
    //   item
    //     .use('sass-resources-loader')
    //     .loader('sass-resources-loader')
    //     .options({
    //       resources: ['./src/styles/themes/index.scss'],
    //     })
    //     .end()
    // })

    // config.module
    //   .rule('md')
    //   .test(/\.md$/)
    //   .use('text-loader')
    //   .loader('text-loader')
    //   .end
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash',
        app: resolve('src/utils/__provider'),
      }),
    ],
  },
}
