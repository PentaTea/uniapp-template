import 'reflect-metadata'

import Vue from 'vue'
import App from './App'

//#ifdef MP-WEIXIN
import '@app/utils/patchVueCompositionApi'
//#endif
import '@app/utils/mixinUniApi'
import '@app/utils/vueFilter'
import '@app/api'
Vue.config.productionTip = false

// import VueCompositionApi from '@vue/composition-api'
// Vue.use(VueCompositionApi)

import VueDataObjectPath from 'vue-data-object-path'
Vue.use(VueDataObjectPath)

import Component from 'vue-class-component'
Component.registerHooks(['setup', 'beforeRouteUpdate', 'beforeRouteEnter', 'beforeRouteLeave'])

import is from 'is'
Vue.prototype.uni = uni
Vue.prototype.is = is
Vue.prototype.log = (...args) => console.log(...args)
console.log(process.env)
Vue.prototype.parseImg = (path) => process.env.VUE_APP_IMG_URL + path

//全局组件
// import xxx from '@app/components/xxx'
// Vue.component('xxx', xxx)

new App({}).$mount()
