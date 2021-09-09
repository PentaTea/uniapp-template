<template>
  <div
    class="render-container"
    :markdown="muya.markdown"
    :busData="busData"
    :change:busData="handler.editorReceive(busData)"
    :isMounted="isMounted"
    :change:isMounted="handler.init"
  >
    <div id="editor"></div>
    <div id="editor-float-container"></div>
  </div>
</template>

<script lang="ts">
import Vue, { Component } from './MuyaRender.ts'
@Component({
  components: {},
})
export default class extends Vue {}
</script>

<script module="handler" lang="renderjs">
import init from './editor_init'
export default {
  data() {
    return {
      //#ifdef APP-PLUS
      muya: new Proxy(
        {},
        {
          set: (target, property, value, receiver) => {
            this.$ownerInstance.callMethod('update', { property, value })
            target[property] = value
            return true
          },
        }
      ),
      //#endif
      instance: null,
    }
  },
  computed: {},
  methods: {
      init,
    editorReceive(data){
      hashBus.receive(data)
    }
  },
}
</script>

<style lang="scss" scoped>
.render-container {
  width: 100%;
  height: 100%;
}
</style>
