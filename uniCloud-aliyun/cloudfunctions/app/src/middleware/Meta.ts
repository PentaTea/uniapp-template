export default () => {
  return async function meta(ctx, next) {
    const timeStart = +new Date()
    await next()
    ctx.body = Object.assign(ctx.body, { __DURATION: +new Date() - timeStart })
  }
}
