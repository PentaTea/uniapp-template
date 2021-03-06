import 'reflect-metadata'

import Vue from 'vue'
import App from './App'

//#ifdef MP-WEIXIN
import '@app/common/patchVueCompositionApi'
//#endif
import '@app/utils'
import '@app/common/vueFilter'
import '@app/api'
import '@app/common/errorHandler'
Vue.config.productionTip = false
// Vue.config.performance = true

//#ifdef H5
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import 'element-ui/lib/theme-chalk/index.css'
//#endif

import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import VueDataObjectPath from 'vue-data-object-path'
Vue.use(VueDataObjectPath)

import Component from 'vue-class-component'
Component.registerHooks(['setup', 'beforeRouteUpdate', 'beforeRouteEnter', 'beforeRouteLeave'])

//基础全局组件
import BasePage from '@app/components/BasePage/BasePage'
Vue.component('BasePage', BasePage)
//通用全局组件
import UniForm from '@app/components/UniForm'
Vue.component('UniForm', UniForm)
import PageMeta from '@dcloudio/uni-cli-shared/components/page-meta.vue'
Vue.component('page-meta', PageMeta)
import UnicloudDB from '@dcloudio/uni-cli-shared/components/unicloud-db.vue'
Vue.component('unicloud-db', UnicloudDB)
//组件库常用组件
//...

new App({}).$mount()
