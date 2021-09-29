export default (options) => {
  let { codeKey = 'code', messageKey = 'message', success, fail } = options || {}
  success = success || { [codeKey]: 200 }
  fail = fail || { [codeKey]: 403, [messageKey]: '拒绝处理' }

  return async function response(ctx, next) {
    const timeStart = +new Date()
    try {
      await next()
    } catch (error) {
      console.error('error :>> ', error)
      if (_.isObject(error)) ctx.body = error
      else ctx.body = { [codeKey]: 500, [messageKey]: error.message || error || '内部错误' }
      return
    }
    //服务端响应结果
    const body = ctx.body
    // console.log(body)

    //返回undefined
    if (_.isNil(body)) {
      ctx.body = success
      return
    }

    //返回boolean
    if (_.isBoolean(body)) {
      ctx.body = body ? success : fail
      return
    }

    //返回JSON
    if (_.isObject(body)) {
      ctx.body = Object.assign({}, success, { data: body })
      return
    }

    //返回字符串
    if (_.isString(body)) {
      ctx.body = { ...fail, [messageKey]: body }
      return
    }
    //返回数字
    if (_.isNumber(body)) {
      ctx.body = { [codeKey]: body }
      return
    }

    ctx.body = Object.assign({}, { code: 202 }, ctx.body)
    return
  }
}
