<template>
  <div>
    <div class="fab left" id="muya-fab-left">
      <div v-for="(name, i) in leftFabs" :key="i" class="item" @mousedown.prevent="run(name)">
        <i :class="i"></i>
      </div>
    </div>
    <div class="fab right" id="muya-fab-left">
      <div v-for="(e, type) in otherItems" :key="type">
        <div
          v-for="(name, icon) in e"
          :key="icon"
          class="item"
          :class="{ hidden: !match(type) }"
          @mousedown.prevent="run(name)"
        >
          <i :class="icon"></i>
        </div>
      </div>

      <div
        v-for="(name, i) in staticItems"
        :key="i"
        class="item"
        :class="{}"
        @mousedown.prevent="run(name)"
      >
        <i :class="i"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from './mixins'

@Component({
  components: {},
})
export default class extends Vue {
  fabs = {
    static: {
      'ri-check-line'(this: typeof Vue.prototype) {
        this.hashBus.trigger('提交')
      },
    },
    li: {
      'ri-indent-decrease': '删除缩进',
      'ri-indent-increase': '增加缩进',
    },
    'p|li': {},
  }
  leftFabs = {
    'ri-arrow-go-back-line': '撤销',
    'ri-arrow-go-forward-line': '重做',
  }
  get type() {
    return (
      (this.muya.selection.affiliation?.[1] || this.muya.selection.affiliation?.[0])?.type || 'p'
    )
  }
  get staticItems() {
    return this.fabs.static
  }
  get otherItems() {
    const { static: s, ...other } = this.fabs
    return other
  }
  match(str) {
    return new RegExp(str).test(this.type)
  }
  mounted() {
    setTimeout(() => this.hashBus.postMessage('波纹', '#muya-fab-left'), 1000)
    setTimeout(() => this.hashBus.postMessage('波纹', '#muya-fab-right'), 1000)
  }

  run(e) {
    if (typeof e === 'string') this.hashBus.emit(e)
    else e.call(this)
  }
}
</script>

<style lang="scss" scoped>
.fab {
  position: fixed;
  bottom: 10px;
  display: flex;
  padding: 0 10px;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  backdrop-filter: blur(4px);

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }

  div {
    display: flex;
  }

  .item {
    z-index: 100;
    display: flex;
    width: 40px;
    height: 45px;
    opacity: 1;
    transition: opacity 0.3s cubic-bezier(0.18, 0.89, 0.32, 1) 0.1s,
      width 0.3s cubic-bezier(0.18, 0.89, 0.32, 1);
    align-items: center;
    justify-content: center;
  }

  .hidden {
    width: 0;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.18, 0.89, 0.32, 1),
      width 0.3s cubic-bezier(0.18, 0.89, 0.32, 1) 0.1s;
  }
}
</style>
