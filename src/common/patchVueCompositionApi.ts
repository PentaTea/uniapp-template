import Vue from 'vue'
import { isRef, isReadonly } from '@vue/composition-api'

/** uni-app composition api补丁 */
;(() => {
  /** uni-app 会在 beforeUpdate 的时候调用这个函数来进行和微信进程数据的交换 */
  const oldPatch = Vue.prototype.__patch__
  Vue.prototype.__patch__ = function(...arg: any[]) {
    pach(this)
    oldPatch.call(this, ...arg)
  }

  function pach(vm: any) {
    if (vm._computedWatchers === undefined) {
      vm._computedWatchers = {}
    }
    const ret = vm._data
    var rawBindings = getRawBindings(vm)
    if (rawBindings) {
      Object.keys(rawBindings).forEach(function(key) {
        // && vm.mpType === "component"

        if (process.env.NODE_ENV === 'development') {
          /** 开发版补丁 */
          const v = rawBindings[key]
          if (isRef(v)) {
            if (isReadonly(v)) {
              /** 只读的值一般是计算属性，所以放到computed中，要是放到data中uni-app会尝试写，这样导致报错 */
              vm._computedWatchers[key] = v
            } else {
              ret[key] = v.value
            }
          } else {
            ret[key] = v
          }
        } else {
          /** 编译版补丁 */
          ret[key] = undefined
        }
      })
    }
  }

  function getRawBindings(vm: any) {
    return vm.__composition_api_state__ && vm.__composition_api_state__.rawBindings
  }
})()
