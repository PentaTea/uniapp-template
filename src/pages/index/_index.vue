<template>
  <BasePage :tabBar="1">
    <template #navLeft>
      <div>主页</div>
    </template>
    <div class="cu-list menu sm-border margin-top">
      <div class="cu-item arrow" @click="app.to('/pages/playground/index')">演练场</div>
    </div>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from '@app/mixins'

@Component({
  components: {},
  setup(props, context) {},
})
export default class extends Mixins(Vue) {
  onLoad() {
    uni.hideTabBar()
  }
}
</script>

<style lang="scss" scoped></style>
