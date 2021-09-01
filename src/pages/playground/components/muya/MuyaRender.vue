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
import { Vue, Component } from './mixins'

@Component({
  components: {},
})
export default class extends Vue {
  busData = {}

  update(data) {
    this.$set(this.muya, data.property, data.value)
  }
  logicReceive(data) {
    this.hashBus.receive(data)
  }

  isMounted = false
  mounted() {
    //状态栏颜色
    uni.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' })
    //初始化消息总线
    this.hashBus.set({
      name: 'App',
      postHandler: (massage) => (this.busData = massage),
    })

    this.hashBus.use('uploadImg', (context) => {
      const id = context.data.content
      uni.chooseImage({
        count: 1,
        success: (res) => {
          // #ifdef H5
          this.hashBus.postMessage('uploadImgData' + id, res.tempFilePaths[0])
          //转二进制
          uni.request({
            url: res.tempFilePaths[0],
            method: 'GET',
            responseType: 'arraybuffer',
            success: (ress) => {
              console.log(ress)
            },
            fail: (ress) => {
              console.log(ress)
            },
          })
          // #endif
          // #ifdef APP-PLUS
          plus.io.resolveLocalFileSystemURL(res.tempFilePaths[0], (entry) => {
            this.hashBus.postMessage('uploadImgData' + id, entry.fullPath)
            // 转二进制
            entry.file(function(file) {
              var fileReader = new plus.io.FileReader()
              fileReader.readAsDataURL(file)
              fileReader.onloadend = function(evt) {
                var buffer = uni.base64ToArrayBuffer(evt.target.result)
                console.log(buffer)
              }
            })
          })
          // #endif
        },
      })
    })
    this.isMounted = true
  }

  handler
  created() {
    //#if H5
    this.handler || location.reload()
    //#endif
  }
}
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
          set: (target, property, value, receiver) => (
            this.$ownerInstance.callMethod('update', { property, value }), true
          ),
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
