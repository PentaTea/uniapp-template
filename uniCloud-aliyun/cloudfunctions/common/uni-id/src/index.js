import fs from 'fs'
import path from 'path'
import { wrapFn } from './share/index'
import { I18n } from '@dcloudio/uni-i18n'
import messages from './lang/index'

import * as methodList from './uni-id'

let createConfig
try {
  createConfig = require('uni-config-center')
} catch (error) {}

class UniID {
  constructor({ context, config } = {}) {
    const pluginConfig =
      createConfig &&
      createConfig({
        pluginId: 'uni-id',
      })
    this.pluginConfig = pluginConfig
    this.config = config || this._getConfigContent()
    // 兼容旧uni-id逻辑（非开发者调用createInstance创建），防止__ctx__被缓存在uni-id内部
    // this.context = context
    Object.defineProperty(this, 'context', {
      get() {
        return context || global.__ctx__ || {}
      },
    })
    // keys: customToken
    this.interceptorMap = new Map()
    if (pluginConfig && pluginConfig.hasFile('custom-token.js')) {
      this.setInterceptor('customToken', require(pluginConfig.resolve('custom-token.js')))
    }
    let i18n
    if (uniCloud.initI18n) {
      i18n = uniCloud.initI18n({
        locale: this.context.LOCALE || 'zh-CN',
        fallbackLocale: 'zh-Hans',
        messages,
      })
    } else {
      i18n = new I18n({
        locale: this.context.LOCALE || 'zh-CN',
        fallbackLocale: 'zh-Hans',
        messages,
      })
      console.warn(i18n.t('hx-version-warning'))
    }
    this.t = i18n.t.bind(i18n)
  }

  get dev() {
    console.warn(this.t('dev-warning'))
    return {
      getConfig: this._getConfig.bind(this),
    }
  }

  _parseConfig(configContent) {
    // require [1,2] => {0:1,1:2}
    if (Array.isArray(configContent)) {
      return configContent
    }
    return configContent[0] ? Object.values(configContent) : configContent
  }

  _getCurrentAppConfig(config) {
    if (!Array.isArray(config)) {
      return config
    }
    if (!this.context.APPID) {
      throw new Error(
        this.t('context-param-required', {
          param: 'APPID',
        })
      )
    }
    return (
      config.find((item) => item.dcloudAppid === this.context.APPID) ||
      config.find((item) => item.isDefaultConfig)
    )
  }

  _getConfigContent() {
    // 使用uni-config-center
    if (this.pluginConfig && this.pluginConfig.hasFile('config.json')) {
      this._hasConfigFile = true
      try {
        return this._parseConfig(this.pluginConfig.config())
      } catch (error) {
        return
      }
    }
    const configFilePath = path.resolve(__dirname, 'config.json')
    this._hasConfigFile = fs.existsSync(configFilePath)
    try {
      return this._parseConfig(require(configFilePath))
    } catch (error) {}
  }

  init(config) {
    console.warn('uniID.init has been deprecated, use uniID.createInstance instead')
    this.config = config
  }

  setInterceptor(timing, handler) {
    this.interceptorMap.set(timing, handler)
  }

  _getConfig(platform) {
    // 每次都获取最新配置，不要修改此处逻辑
    const hasConfig = this.config && Object.keys(this.config).length !== 0
    if (this._hasConfigFile && !hasConfig) {
      throw new Error(this.t('config-file-invalid'))
    } else if (!hasConfig) {
      throw new Error(this.t('config-file-not-found'))
    }
    const currentAppConfig = this._getCurrentAppConfig(this.config)
    const platformConfig =
      Object.assign(currentAppConfig, currentAppConfig[platform || this.context.PLATFORM]) || {}
    const defaultConfig = {
      bindTokenToDevice: false,
      tokenExpiresIn: 7200,
      tokenExpiresThreshold: 1200,
      passwordErrorLimit: 6,
      passwordErrorRetryTime: 3600,
      usernameToLowerCase: true,
      emailToLowerCase: true,
    }
    const config = Object.assign(defaultConfig, platformConfig)
    const argsRequired = [
      'passwordSecret',
      'tokenSecret',
      'tokenExpiresIn',
      'passwordErrorLimit',
      'passwordErrorRetryTime',
    ]
    argsRequired.forEach((item) => {
      if (!config || !config[item]) {
        throw new Error(
          this.t('config-param-required', {
            param: item,
          })
        )
      }
    })
    return config
  }
}

for (const key in methodList) {
  UniID.prototype[key] = methodList[key]
  // if (key.indexOf('_') === 0) {
  //   UniID.prototype[key] = methodList[key]
  // } else {
  //   UniID.prototype[key] = wrapFn(methodList[key])
  // }
}

// const deprecateMethodList = ['wxBizDataCrypt', 'verifyAppleIdentityToken', 'code2SessionWeixin', 'code2SessionAlipay']

function createInstance({ context, config } = {}) {
  const uniIDOrigin = new UniID({
    context,
    config,
  })
  const uniID = new Proxy(uniIDOrigin, {
    get(target, prop) {
      if (prop in target && prop.indexOf('_') !== 0) {
        if (typeof target[prop] === 'function') {
          // if (deprecateMethodList.indexOf(prop) > -1) {
          //   console.warn(`uniID.${prop}方法即将废弃，后续版本将不再暴露此方法`)
          // }
          return wrapFn(target[prop]).bind(target)
        } else {
          return target[prop]
        }
      }
      return undefined
    },
  })
  return uniID
}

UniID.prototype.createInstance = createInstance

export default createInstance()
