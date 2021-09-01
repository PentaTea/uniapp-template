<template>
  <div class="status-bar">
    <div class="status">
      <i class="ri-close-line" @click.stop="() => app.back()"></i>
      <ul>
        <li>{{ muya.fileInfo.name }}</li>
        <li>{{ muya.wordCount }} 字</li>
        <li style="width: 9em;text-align: center;">
          {{ stateDoc }}
        </li>
        <!-- <li @click.stop="hashBus.trigger('dropMenu')">
            <i class="ri-menu-line"></i>
          </li> -->
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from './mixins'
import { stateDocText } from './utils'

@Component({
  components: {},
})
export default class extends Vue {
  get stateDoc() {
    return stateDocText[this.muya.stateDoc]
  }
}
</script>

<style lang="scss" scoped>
.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 750rpx;
  height: calc(var(--statusBarHeight) + 56px);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);

  .status {
    position: fixed !important;
    top: var(--statusBarHeight) !important;
    display: flex;
    width: 100%;
    height: 28px;
    color: var(--iconColor);
    align-items: center;
    justify-content: space-between;

    > i {
      display: flex;
      float: left;
      width: 35px;
      height: 28px;
      margin: 0 2px;
      font-size: 24px;
      color: var(--iconColor);
      align-items: center;
      justify-content: space-around;
    }

    ul {
      display: flex;
      padding: 0 7px;
      margin: 0;

      li {
        position: relative;
        display: flex;
        height: 28px;
        padding: 0 8px;
        font-size: 12px;
        list-style: none;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
