import platformApi from '../../platforms/index'
export default function getWeixinApi({ platform } = {}) {
  const clientPlatform = platform || this.context.PLATFORM
  if (!clientPlatform) {
    throw new Error(
      this.t('context-param-required', {
        parma: 'PLATFORM',
      })
    )
  }
  const config = this._getConfig(clientPlatform)
  if (!config.oauth || !config.oauth.weixin) {
    throw new Error(
      this.t('config-param-require', {
        param: `${clientPlatform}.weixin`,
      })
    )
  }
  const argsRequired = ['appid', 'appsecret']
  argsRequired.forEach((item) => {
    if (!config.oauth.weixin[item]) {
      throw new Error(
        this.t('config-param-require', {
          param: `${clientPlatform}.weixin.${item}`,
        })
      )
    }
  })
  const weixinApi = platformApi.initWeixin({ ...config.oauth.weixin, clientType: clientPlatform })
  return weixinApi
}
