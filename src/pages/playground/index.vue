<template>
  <BasePage title="演练场">
    <div class="padding-top"></div>
    <div class="cu-bar bg-white solid-bottom">
      <div class="action">
        grid布局
      </div>
    </div>
    <div class="cu-list grid col-4 no-border">
      <div class="cu-item" @click="app.to('null/testIntercept')">
        <i class="ri-router-line text-blue"></i>
        <text>路由拦截</text>
      </div>
      <div class="cu-item" @click="app.to('user/login')">
        <i class="ri-account-box-line text-purple"></i>
        <text>登录</text>
      </div>
      <div class="cu-item" @click="app.to('card')">
        <i class="ri-bank-card-fill text-olive"></i>
        <text>颜色容器生成</text>
      </div>
      <div class="cu-item" @click="app.to('form')">
        <i class="ri-layout-row-fill text-red"></i>
        <text>表单生成</text>
      </div>
      <div class="cu-item" @click="app.to('trtc')">
        <i class="ri-phone-fill"></i>
        <text>小程序trtc</text>
      </div>
    </div>
    <div class="cu-bar bg-white solid-bottom margin-top">
      <div class="action">
        表单布局
      </div>
    </div>
    <div class="cu-form-group">
      <div class="title">rem单位基准</div>
      <slider
        :value="a(app.Global.rootFontSize)"
        :min="12"
        :max="20"
        :step="1"
        @changing="
          (e) =>
            app.Global.rootFontSize != e.detail.value && (app.Global.rootFontSize = e.detail.value)
        "
        @change="(e) => (app.Global.rootFontSize = e.detail.value)"
      ></slider>
      <div style="width: 50rpx;">{{ a(app.Global.rootFontSize) + 'px' }}</div>
    </div>
    <div class="cu-form-group">
      <text class="rem padding-sm">
        {{
          '这是一段尺寸为 1rem 的文字。\n怒发冲冠，凭栏处、潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切！\n靖康耻，犹未雪。臣子恨，何时灭！驾长车，踏破贺兰山缺。壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头、收拾旧山河，朝天阙。'
        }}
      </text>
    </div>
    <MagicWindow></MagicWindow>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from '@app/mixins'
import MagicWindow from './components/MagicWindow/MagicWindow.vue'

@Component({
  components: { MagicWindow },
  setup(props, context) {},
})
export default class extends Mixins(Vue) {}
</script>

<style lang="scss" scoped>
.rem {
  font-size: 1rem;
  line-height: 1.6rem;
}
</style>
