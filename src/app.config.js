/**
 * 约定大于配置
 * 1. 路由会自动生成,需要更改某页面属性时才更改 packages
 * 2. 本文件优先级大于自动路由
 * 3. 约定 src/pages/index 为主包, src/pages/ 下其他文件夹为分包
 * 4. packages 中只需写包名和文件名
 *
 */
const packages = {
  index: {
    _index: {},
  },
  //生产环境禁用 playground 分包
  playground: process.env.NODE_ENV === 'production' ? false : {},
  admin: {
    index: { icon: 'ri-dashboard-3-line', name: '主页' },
    dashboard: { icon: 'ri-dashboard-line', name: '控制台' },
  },
  oldadmin: false,
}

const loginPage = '/pages/user/login'

const tabBar = {
  list: [
    {
      pagePath: 'pages/index/_index',
      text: '主页',
      // iconPath: '/static/images/xxx.png',
      // selectedIconPath: '/static/images/xxx.png',
    },
    {
      pagePath: 'pages/index/_my',
      text: '关于我',
    },
  ],
}

const about = {
  //应用名称
  appName: 'uniapp-模板',
  //应用logo
  logo: '/static/logo.png',
  //公司名称
  company: '北京xx网络技术有限公司',
  //口号
  slogan: '云端一体应用快速开发模版',
  //政策协议
  agreements: [
    {
      title: '用户服务协议', //协议名称
      url: '请填写用户服务协议链接', //对应的网络链接
    },
    {
      title: '隐私政策',
      url: '请填写隐私政策链接',
    },
  ],
  //应用的链接，用于分享到第三方平台和生成关于我们页的二维码
  download: '',
  //version
  version: '1.0.0', //用于非app端显示，app端自动获取
}

const router = {
  /**
   *二选一：
   *  1.needLogin：黑名单模式。枚举游客不可访问的页面。
   *  2.visitor：白名单模式。枚举游客可访问的页面。
   */
  needLogin: [
    { pattern: /^\/pages\/null\/.*/ }, //支持正则表达式
    // '/pages/null/testIntercept',
  ],
  //配置登陆类型与优先级
  login: ['username', 'smsCode'],
}

module.exports = {
  packages,
  loginPage,
  tabBar,
  globalStyle: {
    // 默认状态栏颜色
    navigationBarTextStyle: 'black',
  },
  h5: {
    url: '', //	前端域名
    // 在h5端全局悬浮引导用户下载app => src/common/openApp.ts
    openApp: {
      openUrl: '/#/pages/invite/invite',
      appname: about.appName,
      logo: './static/logo.png',
    },
  },
  about,
  router,
}
