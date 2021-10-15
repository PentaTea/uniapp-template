import platformApi from '../../platforms/index'
export default function getAlipayApi({ platform } = {}) {
  const clientPlatform = platform || this.context.PLATFORM
  if (!clientPlatform) {
    throw new Error(
      this.t('context-param-required', {
        parma: 'PLATFORM',
      })
    )
  }
  const config = this._getConfig(clientPlatform)
  if (!config.oauth || !config.oauth.alipay) {
    throw new Error(
      this.t('config-param-require', {
        param: `${clientPlatform}.alipay`,
      })
    )
  }
  const argsRequired = ['appid', 'privateKey']
  argsRequired.forEach((item) => {
    if (!config.oauth.alipay[item]) {
      throw new Error(
        this.t('config-param-require', {
          param: `${clientPlatform}.alipay.${item}`,
        })
      )
    }
  })
  const alipayApi = platformApi.initAlipay({ ...config.oauth.alipay, clientType: clientPlatform })
  return alipayApi
}
