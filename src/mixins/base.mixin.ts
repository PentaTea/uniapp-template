import { Component, Vue as orgVue } from 'vue-property-decorator'
import { Router } from '@app/enums'
import is from 'is'
import querystring from 'querystring'

console.log(12344)

//混入不需要 MVVM 的变量
orgVue.prototype.uni = uni
orgVue.prototype.app = app
orgVue.prototype.is = is
orgVue.prototype.env = process.env
orgVue.prototype.log = (...args) => console.log(...args)
orgVue.prototype.parseImg = (path) => process.env.VUE_APP_IMG_URL + path
orgVue.prototype.a = (arg) => arg //本函数帮助微信小程序中数据层显式传值到视图层

// 挂载视图层变量
@Component({})
export class Vue extends orgVue {}
