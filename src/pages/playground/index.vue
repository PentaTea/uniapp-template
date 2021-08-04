<template>
  <BasePage title="演练场">
    <div class="cu-bar bg-white solid-bottom margin-top">
      <div class="action">
        grid布局
      </div>
    </div>
    <div class="cu-list grid col-5 no-border">
      <div class="cu-item">
        <i class="ri-text-spacing text-olive"></i>
        <text>rem适配</text>
      </div>
    </div>
    <div class="cu-bar bg-white solid-bottom margin-top">
      <div class="action">
        列表
      </div>
    </div>
    <div class="cu-list menu sm-border">
      <div class="cu-item arrow">带箭头的cell项</div>
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

<style lang="scss" scoped></style>
