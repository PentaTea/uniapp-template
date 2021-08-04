// mescroll-body 和 mescroll-uni 通用
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export class MescrollMixin extends Vue {
  mescroll: any = null //mescroll实例对象

  mounted() {
    this.mescrollInitByRef() // 兼容字节跳动小程序, 避免未设置@init或@init此时未能取到ref的情况
  }

  // 注册系统自带的下拉刷新 (配置down.native为true时生效, 还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
  onPullDownRefresh() {
    this.mescroll && this.mescroll.onPullDownRefresh()
  }

  // 注册列表滚动事件,用于判定在顶部可下拉刷新,在指定位置可显示隐藏回到顶部按钮 (此方法为页面生命周期,无法在子组件中触发, 仅在mescroll-body生效)
  onPageScroll(e) {
    this.mescroll && this.mescroll.onPageScroll(e)
  }

  // 注册滚动到底部的事件,用于上拉加载 (此方法为页面生命周期,无法在子组件中触发, 仅在mescroll-body生效)
  onReachBottom() {
    this.mescroll && this.mescroll.onReachBottom()
  }

  // mescroll组件初始化的回调,可获取到mescroll对象
  mescrollInit(mescroll) {
    this.mescroll = mescroll
    this.mescrollInitByRef() // 兼容字节跳动小程序
  }
  // 以ref的方式初始化mescroll对象 (兼容字节跳动小程序)
  mescrollInitByRef() {
    if (!this.mescroll || !this.mescroll.resetUpScroll) {
      const mescrollRef: any = this.$refs.mescrollRef
      if (mescrollRef) this.mescroll = mescrollRef.mescroll
    }
  }
  // 下拉刷新的回调 (mixin默认resetUpScroll)
  downCallback() {
    console.log('downCallback')

    setTimeout(() => {
      // this.mescroll.resetUpScroll()
      this.mescroll.endSuccess()
    }, 500)
  }
  // 上拉加载的回调
  upCallback() {
    console.log('upCallback')

    // mixin默认延时500自动结束加载
    setTimeout(() => {
      this.mescroll.endSuccess()
      // this.mescroll.endErr()
    }, 500)
  }
}
