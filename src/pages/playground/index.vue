<template>
  <BasePage title="演练场">
    <div class="cu-bar bg-white solid-bottom margin-top">
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
    </div>
    <div class="cu-bar bg-white solid-bottom margin-top">
      <div class="action">
        表单
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
      <div>{{ a(app.Global.rootFontSize) + 'px' }}</div>
    </div>
    <div class="cu-form-group">
      <text class="rem padding-sm">
        {{
          '这是一段尺寸为 1rem 的文字。\n究急個都出人洲算樣改時館到好進我出開把？有兒你總研一早生就民：拿手藝還十為們良。\n國不製；規來王！看風日經地；流市而，運也雖法銷的際不麼沒友；生路以清開天華的通來雜……'
        }}
      </text>
    </div>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from '@app/mixins'

@Component({
  components: {},
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
