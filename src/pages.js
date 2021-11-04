const { hot } = require('uni-pages-hot-modules') //向 webpack 注册热更组件
const is = require('is')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
/**
 * 本文件用于解析 app.config.js 并生成相应 pages.json
 */
module.exports = hot((pagesJson) => {
  const config = _.merge(pagesJson, require('./app.config.js')) //合并配置
  try {
    const root = 'pages' //根目录
    const mainKey = 'index' //主包名字

    /** @type {Record<string, Record<string, StyleObject>>} */
    const Route = {} //路由树

    /**
     * ---------------------
     * 开始查找页面文件并构建路由配置
     * ---------------------
     */
    //遍历查找页面,按照路径结构存入路由树
    findPage(path.resolve('src', root)).forEach((e) => {
      //确定路径分隔符,适配windows风格路径
      const separ = e.includes('\\') ? '\\' : '/'
      const pagePath = path
        .relative(path.resolve('src', root), e)
        .replace(/\.n?vue$/, '')
        .split(separ)
      Route[pagePath[0]] = Route[pagePath[0]] || {}
      Route[pagePath[0]][pagePath[1]] = {}
    })

    //将配置文件混入自动生成的页面树
    const pages = _.merge(Route, config.packages)
    // console.log(pages)
    config.pages = [] //主包
    config.subPackages = [] //分包
    let PackagesNames = Object.keys(pages)

    /**
     * ---------------------
     * 配置生成完毕
     * 开始构建符合 page.json 规范的主包分包配置
     * ---------------------
     */
    //主包配置
    const mainPackages = pages[mainKey]
    for (const key in mainPackages) {
      mainPackages[key] &&
        config.pages[key.includes('index') ? 'unshift' : 'push'](
          PackPage([root, mainKey, key].join('/'), mainPackages[key], config)
        )
    }

    //分包配置
    PackagesNames = PackagesNames.filter((name) => pages[name] && name !== mainKey)
    PackagesNames.forEach((PackagesName) => {
      const subPackagesPages = []
      for (const key in pages[PackagesName]) {
        pages[PackagesName][key] &&
          subPackagesPages.push(PackPage(key, pages[PackagesName][key], config, PackagesName))
      }
      config.subPackages.push({
        root: [root, PackagesName].join('/'),
        pages: subPackagesPages,
      })
    })
  } catch (error) {
    console.log(error)
  }
  //输出给 page.json
  return config
})

/**
 * 打包页面配置
 * @param {string} path //路径
 * @param {object | boolean} config //源配置
 * @param {object} target //目标配置
 * @param {string} PackagesName //包名
 * @returns {{path: string, style?: object}}
 */
function PackPage(path, config, target, PackagesName) {
  if (is.object(config)) {
    const noAdminWindow = {
      topWindow: false,
      leftWindow: false,
      rightWindow: false,
    }
    return {
      path,
      style: { ...(PackagesName != 'admin' ? noAdminWindow : {}), ...config },
    }
  } else return { path }
}

/**
 * 深搜遍历寻找页面路径
 * @param {string} filePath 目标文件夹
 * @param {string[]} list 路径缓存数组,用于递归时保留数据
 * @param {number} deep 查询深度
 * @returns {string[]} 查找到的页面路径
 */
function findPage(filePath = 'src/pages', list = [], deep = 1) {
  if (deep > 2) return list
  filePath = path.resolve(filePath)
  fs.readdirSync(filePath).forEach((filename) => {
    const filedir = path.join(filePath, filename)
    const stats = fs.statSync(filedir)
    if (stats.isFile() && /\.n?vue$/.test(filename)) list.push(filedir)
    if (stats.isDirectory()) findPage(filedir, list, deep + 1)
  })
  return list
}
