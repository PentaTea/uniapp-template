export default (options) => {
  return async function auth(ctx, next) {
    global.uniID = require('uni-id').createInstance({
      context: ctx,
    })
    var auth = null
    if (ctx.event.uniIdToken)
      auth = await uniID.checkToken(ctx.event.uniIdToken, { needUserInfo: false })

    if (auth && auth.code) {
      // 校验失败，抛出错误信息
      throw { code: 401, message: auth.msg + ',请重新登录' }
    }
    global.AUTH = auth // 设置当前请求的 auth 对象
    await next()
    const { token, tokenExpired } = auth || {}
    if (token && tokenExpired && isObject(ctx.body)) {
      Object.assign(ctx.body, {
        token,
        tokenExpired,
      })
    }
    global.AUTH = null
  }
}
