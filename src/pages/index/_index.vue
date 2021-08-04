<template>
  <div class="page flex-center flex-direction padding">
    <div>
      <span @click="() => app.Global.rootFontSize++">1rem文字</span>
      <span>rootFontSize={{ a(app.Global.rootFontSize) }}</span>
    </div>
  </div>
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
.page {
  height: 400rpx;
  padding: 100rpx;
  font-size: 1rem;
  align-items: center;
  justify-content: center;
}
</style>
