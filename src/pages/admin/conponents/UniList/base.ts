import { Vue, Component, Prop, PropSync, Watch, InjectReactive } from 'vue-property-decorator'
@Component({})
export default class extends Vue {
  /** 自定义api,具体实现需要重写custom的fetch方法 */
  @Prop({ default: '' }) api?: any
  /** 标题 */
  @Prop({ default: '' }) title?: string
  /** 外部数据,传入则放弃使用内部fetch */
  @Prop({ default: null }) data?: Record<string, any>[]
  /** 表格结构 */
  @Prop({ default: null }) schema?: Record<string, any>
  /** 加载状态 */
  @Prop({ default: null }) loading?: Record<string, any>
  /** 搜索按钮文本 */
  @Prop({ default: '查询' }) searchComment?: Record<string, any>
  /** 扩展下拉 */
  @Prop({ default: false }) expand: boolean
  /**
   * 初始化函数,接收一个参数传入本组件实例
   *
   * 可在其中写入或覆盖内部配置和方法
   */
  @Prop({ default: () => {} }) init?: Function

  /**
   * 暴露数据,保存公开状态
   */
  currentPageNow = 1
  selection = []
  pages = { total: 0, current: 1, size: 10 }
  params = {}
  setPages(p) {
    this.pages = { ...this.pages, ...p }
  }

  action = {}
  header = {}
  actionWidth = 200
  actionStyle = {}
  headerStyle = {}
  columnStyle = {}
  searchDropdown = {}

  /**
   * 内部数据,方便处理内部状态和prop冲突的状态
   */
  rawData = [] //请求的列表数据不能直接保存给data,因为data是prop
  protected rawLoading = false
  get loadingValue() {
    return this.loading || this.rawLoading //内部和外部prop任意为真则认为处于loading状态
  }
  //弹窗和覆盖层的状态
  protected rawFormOption = null
  protected rawViewShow = false
  protected rawDialogShow = false
  protected rawActiveForm = ''

  //内部请求函数
  @Watch('pages.current')
  @Watch('pages.size')
  protected async rawFetch() {
    this.$emit('fetch', this)
    if (this.data) return //我们认为如果传了dataProp则由外部代理请求,不应由内部发起请求
    this.rawLoading = true
    const { data, pages } = await this.fetch()
    this.rawData = data
    this.setPages(pages)
    this.currentPageNow = this.pages.current
    this.rawLoading = false
  }

  //由外部更新data,要同步更新页码
  @Watch('data', { immediate: true })
  updateFromOutter() {
    this.currentPageNow = this.pages.current
    this.rawData = this.data
  }

  mounted() {
    const option = this.init?.(this)
    if (option) {
      for (const key in option) {
        if (typeof option[key] == 'object') this[key] = { ...this[key], ...option[key] }
        else this[key] = option[key]
      }
    }
    this.rawFetch()
    console.log(this.$attrs)
  }

  /** 点击搜索 */
  runSearch() {
    // this.setPages({ current: 1 })
    this.rawFetch()
  }

  /**
   * 以下函数是会向外暴露的,可能会被重写,不会被重写的方法在index中
   */

  //刷新函数,由于可能会被重写,内容写在index的mounted中
  reload() {}

  //请求函数
  async fetch() {
    return {
      data: [{ title: '测试数据,请重写custom.ts中的方法覆盖测试fecth方法' }],
      pages: {
        total: 1,
        current: 1,
      },
    }
  }
}
