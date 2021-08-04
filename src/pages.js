const { hot } = require('uni-pages-hot-modules')
const is = require('is')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
/**
 * 本文件用于解析 app.config.js
 */
module.exports = hot((pagesJson) => {
  const config = _.merge(pagesJson, require('./app.config.js'))
  try {
    const root = 'pages' //根目录
    const mainKey = 'index'
    const Route = {}
    findPage(path.resolve('src', root)).forEach((e) => {
      const pagePath = path
        .relative(path.resolve('src', root), e)
        .replace('.vue', '')
        .split('/')
      Route[pagePath[0]] = Route[pagePath[0]] || {}
      Route[pagePath[0]][pagePath[1]] = {}
    })

    const pages = _.merge(Route, config.packages)
    // console.log(pages)
    config.pages = [] //主包
    config.subPackages = [] //分包
    let PackagesNames = Object.keys(pages)

    //主包配置
    const mainPackages = pages[mainKey]
    for (const key in mainPackages) {
      mainPackages[key] &&
        config.pages.push(PackPage([root, mainKey, key].join('/'), mainPackages[key], config))
    }

    //分包配置
    PackagesNames = PackagesNames.filter((name) => pages[name] && name !== mainKey)
    PackagesNames.forEach((PackagesName) => {
      const subPackagesPages = []
      for (const key in pages[PackagesName]) {
        pages[PackagesName][key] &&
          subPackagesPages.push(PackPage(key, pages[PackagesName][key], config))
      }
      config.subPackages.push({
        root: [root, PackagesName].join('/'),
        pages: subPackagesPages,
      })
    })
  } catch (error) {
    console.log(error)
  }
  return config
})

function PackPage(path, config, target) {
  if (is.object(config)) {
    let style = {}
    if (config.tabBar) {
      target.tabBar = target.tabBar || {}
      target.tabBar.list = target.tabBar.list || []
      target.tabBar.list.push({
        pagePath: path,
        ...config.tabBar,
      })
    }
    if (config.style) {
      style = config.style
    }

    return {
      path,
      ...style,
    }
  } else return { path }
}

function findPage(filePath = 'src/pages', list = [], deep = 1) {
  if (deep > 2) return list
  filePath = path.resolve(filePath)
  fs.readdirSync(filePath).forEach((filename) => {
    const filedir = path.join(filePath, filename)
    const stats = fs.statSync(filedir)
    if (stats.isFile() && /\.vue$/.test(filename)) list.push(filedir)
    if (stats.isDirectory()) findPage(filedir, list, deep + 1)
  })
  return list
}
