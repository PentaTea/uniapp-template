<template>
  <div class="fab">
    <template v-for="(e, type) in otherItems">
      <div
        v-for="(name, icon) in e"
        :key="icon"
        class="item"
        :class="{ hidden: !match(type) }"
        @mousedown="
          (event) => {
            event.preventDefault()
            hashBus.emit(name)
          }
        "
      >
        <i :class="icon"></i>
      </div>
    </template>

    <div
      v-for="(e, i) in staticItems"
      :key="i"
      class="item"
      @mousedown="
        (event) => {
          event.preventDefault()
          hashBus.emit(e)
        }
      "
    >
      <i :class="i"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from './mixins'

const fabs = {
  static: {
    'ri-check-line': '提交',
  },
  li: {
    'ri-indent-decrease': '删除缩进',
    'ri-indent-increase': '增加缩进',
  },
  'p|li': {},
}

@Component({
  components: {},
})
export default class extends Vue {
  get type() {
    return (
      (this.muya.selection.affiliation?.[1] || this.muya.selection.affiliation?.[0])?.type || 'p'
    )
  }
  get staticItems() {
    return fabs.static
  }
  get otherItems() {
    // const items = {}
    // const { static: s, ...other } = fabs
    // Object.keys(other).forEach((key) => {
    //   if (new RegExp(key).test(this.type)) Object.assign(items, other[key])
    // })

    // return {
    //   ...items,
    //   ...s,
    // }
    const { static: s, ...other } = fabs
    return other
  }
  match(str) {
    return new RegExp(str).test(this.type)
  }
  mounted() {}
}
</script>

<style lang="scss" scoped>
.fab {
  position: fixed;
  right: 10px;
  bottom: 10px;
  display: flex;
  padding: 0 10px;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  backdrop-filter: blur(4px);

  .item {
    display: flex;
    width: 40px;
    height: 45px;
    opacity: 1;
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1);
    align-items: center;
    justify-content: center;
  }

  .hidden {
    width: 0;
    opacity: 0;
  }
}
</style>
