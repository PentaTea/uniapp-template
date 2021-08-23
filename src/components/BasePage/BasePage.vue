<template>
  <div
    class="page theme-default"
    :style="{
      background: background,
    }"
  >
    <TuiNavigationBar
      v-if="!customNav"
      :splitLine="splitLine"
      :isOpacity="false"
      :backgroundColor="navColor.background"
      :color="navColor.color"
      :noPlaceholder="noPlaceholder"
      :zIndex="996"
      :capsule="capsule"
      @init="initNavigation"
    >
      <div
        class="full flex-center justify-between padding-lr"
        :style="{
          color: navColor.color,
          fontSize: navHeight * 0.4 + 'px',
        }"
      >
        <slot name="navLeft">
          <div class="flex-center">
            <i
              class="ri-arrow-left-s-line exhot"
              :style="{ fontSize: navHeight * 0.55 + 'px' }"
              @click="app.back()"
            ></i>

            <div class="margin-left-sm">
              {{ title }}
            </div>
          </div>
        </slot>
        <slot name="navRight"><div></div></slot>
      </div>
    </TuiNavigationBar>
    <mescroll-uni
      ref="mescrollRef"
      :fixed="false"
      :height="scrollHeight"
      :down="{ use: down }"
      :up="{ use: up }"
      :toTop="{ src: null }"
      @init="mescrollInit"
      @down="(page) => ($emit('down', page), page.resetUpScroll())"
      @up="(page) => $emit('up', page)"
    >
      <div style="border-top: 1rpx solid transparent;">
        <slot></slot>
      </div>
    </mescroll-uni>
    <Tabbar v-if="tabBar" :current="tabBar - 1" :tabBar="tabbarList" @click="tabbarSwitch"></Tabbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Mixins, Vue } from '@app/mixins'
import TuiNavigationBar from './tui-navigation-bar.vue'
import Tabbar from './tui-tabbar.vue'
import { MescrollMixin } from '@app/components/mescroll/mescroll-uni/mescroll-mixins'
import MescrollUni from '@app/components/mescroll/mescroll-uni/mescroll-uni.vue'

@Component({
  name: 'BasePage',
  components: {
    TuiNavigationBar,
    Tabbar,
    MescrollUni,
  },
})
export default class extends Mixins(Vue, MescrollMixin) {
  @Prop({ default: '' }) title: string
  @Prop({ default: false }) customNav: boolean
  @Prop({ default: false }) splitLine: boolean
  @Prop({ default: false }) noPlaceholder: boolean
  @Prop({ default: '' }) background: string
  @Prop({ default: '#fff' }) navBackgroundColor: string
  @Prop({ default: 0 }) exHeight: number
  @Prop({ default: 0 }) tabBar: number
  @Prop({ default: true }) capsule: boolean
  @Prop({ default: false }) down: boolean
  @Prop({ default: false }) up: boolean
  @Prop({
    default: () => ({
      background: '#fff',
      color: '#011627',
    }),
  })
  navColor: object

  navHeight = 0
  mounted() {}

  initNavigation(e) {
    this.navHeight = e.height - e.statusBarHeight
    app.Global.navData = e
  }

  get tabbarList() {
    return app.config.tabBar.list
  }

  tabbarSwitch(e) {
    console.log(e)
    uni.switchTab({ url: '/' + e.pagePath })
  }
  windowHeight = uni.getSystemInfoSync().windowHeight
  get scrollHeight() {
    return (
      this.windowHeight -
      (!this.noPlaceholder ? app.Global.navData.height : 0) -
      this.exHeight -
      (this.tabBar ? uni.upx2px(100) : 0) +
      'px'
    )
  }
}
</script>
<style lang="scss">
.page {
  width: 750rpx;
  color: var(--textColor);
  // background: var(--light100);
  background: #f3f5f9;
}
</style>
