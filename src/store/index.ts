import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { createProxy, extractVuexModule, VuexModule } from 'vuex-class-component'
import { Global, User } from '@app/store/module'
const mList = {
  Global,
  User,
}

const ModuleTree = {}
for (const key in mList) {
  if (Object.prototype.hasOwnProperty.call(mList, key)) {
    const e = mList[key]
    Object.assign(ModuleTree, extractVuexModule(e))
  }
}
export const store = new Vuex.Store({
  modules: ModuleTree,
})

export const Module = {} as {
  [K in keyof typeof mList]: ReturnType<typeof createProxy> & InstanceType<typeof mList[K]>
}

for (const key in mList) {
  if (Object.prototype.hasOwnProperty.call(mList, key)) {
    Module[key] = createProxy(store, mList[key])
  }
}

Object.keys(Module).forEach((key) => {
  ;(uni as any)[key] = Module[key as keyof ModuleType]
})

type ModuleType = typeof Module

declare global {
  namespace UniApp {
    interface Uni extends ModuleType {}
  }
}
