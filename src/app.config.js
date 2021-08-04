module.exports = {
  /**
   * 约定大于配置
   * 1. 路由会自动生成,需要更改某页面属性时才更改 packages
   * 2. 本文件优先级大于自动路由
   * 3. 约定 src/pages/index 为主包, src/pages/ 下其他文件夹为分包
   * 4. packages 中只需写包名和文件名
   *
   */
  packages: {
    index: {
      _index: {},
    },
    //生产环境禁用 playground 分包
    playground: process.env.NODE_ENV === 'production' ? false : {},
  },

  tabBar: {
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
  },
}
