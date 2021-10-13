import { Component } from 'vue-property-decorator'
import Base from './base'

@Component({})
export default class extends Base {
  /**
   * 请求方法,返回当前页数据和页码数据
   * @return {{pages: {current: number, total: number}, data: any[]}}
   */
  // async fetch() {
  //   // 示例: 如果是函数则调用旧版axios封装,如果包含'/'则直接调用axios,如果是普通字符串则尝试全局post方法
  //   // 请修改本例适配你的项目
  //   const formData = { ...this.params, ...this.pages }
  //   let res

  //   if (typeof this.api == 'function') res = await this.api(formData)
  //   if (this.api.includes?.('/')) res = await axios.post(this.api, formData)
  //   if (typeof this.api == 'string') res = await app.post[this.api](formData)

  //   return { pages: { current: res.num, total: res.total }, data: res.data }
  // }
  //
  /**
   * 刷新方法
   */
  reload() {}
  //
  /**
   * 按钮样式
   * key为按钮名称(可以使用标准glob通配符) value为attr对象,将会被绑定到对应组件
   * 注: '*' 匹配所有
   * 也可以在init函数中覆盖本配置
   */
  actionStyle = {
    '*': { size: 'mini', plain: true },
    删除: { type: 'danger' },
  }
  headerStyle = {
    '*': { size: 'small', type: 'primary' },
    '测试*': { type: 'warning', icon: 'ri-flask-fill', style: 'width:100px' },
  }
  /**
   * 列样式
   * 可以被schema中的value覆盖
   */
  columnStyle = {
    align: 'center',
    minWidth: '150',
  }
  /**
   * 搜索按钮下拉行为
   * 若为空对象则不显示搜索下拉
   */
  searchDropdown = {
    清空查询条件: () => {
      this.rawParams = this['params'] = {}
      this.runSearch()
    },
  }
}
