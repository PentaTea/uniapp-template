import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { createProxy, extractVuexModule, VuexModule } from 'vuex-class-component'
import createPersistedState from 'vuex-persistedstate'
import vuexProxy from './proxy'
import { Module } from './index'

const ModuleList = {} as {
  [K in keyof typeof Module]: ReturnType<typeof createProxy> & InstanceType<typeof Module[K]>
}
const ModuleTree = {}

export function generator(Module) {
  for (const key in Module) {
    if (Object.prototype.hasOwnProperty.call(Module, key)) {
      const e = Module[key]
      Object.assign(ModuleTree, extractVuexModule(e))
    }
  }
  const store = new Vuex.Store({
    modules: ModuleTree,
    plugins: [
      createPersistedState({
        storage: {
          getItem: (key) => uni.getStorageSync(key),
          setItem: (key, data) => uni.setStorage({ key, data }),
          removeItem: (key) => uni.removeStorage({ key }),
        },
      }),
    ],
  })

  for (const key in Module) {
    if (Object.prototype.hasOwnProperty.call(Module, key)) {
      ModuleList[key] = createProxy(store, Module[key])
    }
  }

  //vuex代理,使用代理做一些拦截操作
  Object.keys(ModuleList).forEach((key) => {
    app[key] = new Proxy(
      {},
      {
        set: (target, property, value, receiver) =>
          vuexProxy.set(ModuleList[key], property, value, key),
        get: (target, property, receiver) => vuexProxy.get(ModuleList[key], property, key),
      }
    )
  })

  return {
    ModuleList,
    store,
  }
}
type ModuleType = typeof ModuleList

declare global {
  interface App extends ModuleType {}
}
