<template>
  <BasePage title="颜色容器生成" background="white">
    <div class="grid col-5">
      <div class="cu-item padding-tb flex-center" v-for="i in 50" :key="i">
        <ColorfulCard height="48rpx" width="48rpx" :delay="i * 40"></ColorfulCard>
      </div>
    </div>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from '@app/mixins'
import ColorfulCard from './components/ColorfulCard.vue'

@Component({
  components: {
    ColorfulCard,
  },
})
export default class extends Mixins(Vue) {}
</script>

<style lang="scss" scoped></style>
