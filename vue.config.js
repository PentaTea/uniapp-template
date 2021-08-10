const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const webpack = require('webpack')

module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@app', resolve('src'))
    config.resolve.alias.set('@api', resolve('src/api'))
    config.module
      .rule('page')
      .enforce('pre')
      .test(/\.vue$/)
      .use('addMeta')
      .loader(resolve('loader/addMeta.loader.js')).end
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        app: resolve('src/utils/__provider'),
      }),
    ],
  },
}
