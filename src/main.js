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

import VueCompositionApi from '@vue/composition-api'
import VSwitch from 'v-switch-case'
import VueDataObjectPath from 'vue-data-object-path'
import Component from 'vue-class-component'
Component.registerHooks(['setup', 'beforeRouteUpdate', 'beforeRouteEnter', 'beforeRouteLeave'])
Vue.use(VueCompositionApi)
Vue.use(VSwitch)
Vue.use(VueDataObjectPath)

//全局组件
// import xxx from '@app/components/xxx'
// Vue.component('xxx', xxx)

new App({}).$mount()
