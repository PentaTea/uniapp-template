import platformApi from '../../platforms/index'
export default function getQQApi() {
  const clientPlatform = this.context.PLATFORM
  if (!clientPlatform) {
    throw new Error(
      this.t('context-param-required', {
        parma: 'PLATFORM',
      })
    )
  }
  const config = this._getConfig(clientPlatform)
  if (!config.oauth || !config.oauth.qq) {
    throw new Error(
      this.t('config-param-require', {
        param: `${clientPlatform}.qq`,
      })
    )
  }
  const argsRequired = ['appid', 'appsecret']
  argsRequired.forEach((item) => {
    if (!config.oauth.qq[item]) {
      throw new Error(
        this.t('config-param-require', {
          param: `${clientPlatform}.qq.${item}`,
        })
      )
    }
  })
  const qqApi = platformApi.initQQ({ ...config.oauth.qq, clientType: clientPlatform })
  return qqApi
}
