import { Vue, Component } from './mixins'
export { Component }
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
          plus.io.resolveLocalFileSystemURL(res.tempFilePaths[0], (entry: any) => {
            this.hashBus.postMessage('uploadImgData' + id, entry.fullPath)
            // 转二进制
            entry.file(function(file) {
              var fileReader = new plus.io.FileReader()
              fileReader.readAsDataURL(file)
              fileReader.onloadend = function(evt: any) {
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
