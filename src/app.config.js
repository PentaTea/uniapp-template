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
      _index: { tabBar: { text: '首页' } },
      _my: { tabBar: { text: '关于我' } },
    },
  },
}
