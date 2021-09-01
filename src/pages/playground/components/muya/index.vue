<template>
  <div class="editor-container" :class="{ loading: muya.loading }" :style="cssStr">
    <div class="loading-mask"></div>
    <StatusBar />
    <MuyaRender />
    <Fab />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, ProvideReactive } from '@app/mixins'
import { initData, stateDocText } from './utils'
import MuyaRender from './MuyaRender.vue'
import StatusBar from './StatusBar.vue'
import Fab from './Fab.vue'
import { createBus } from '@app/utils/HashBus'

@Component({
  components: {
    MuyaRender,
    StatusBar,
    Fab,
  },
})
export default class extends Vue {
  @ProvideReactive() muya = initData()
  @ProvideReactive() hashBus = createBus()

  cssMixins = {
    statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 'px',
  }

  get cssStr() {
    let str = ''
    for (const key in this.cssMixins) str += '--' + key + ':' + this.cssMixins[key] + ';'
    return str
  }
}
</script>

<style lang="scss" scoped>
@import './muya.override';

.editor-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: calc(var(--statusBarHeight) + 56px);

  .loading-mask {
    position: fixed;
    z-index: 99999;
    pointer-events: none;
    background: #fff;
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
    @include inset0;
  }

  &.loading .loading-mask {
    opacity: 1;
  }
}
</style>
