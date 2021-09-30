import { TSBufferValidator } from 'tsbuffer-validator'
import schema from '../schema/gen.json'

export default () => {
  return async function(ctx, next) {
    const { params, action } = ctx.event
    const [controller, service] = action.split('/')
    const key = `${controller}/${service.replace(/^\S/, (s) => s.toUpperCase())}`
    if (Object.keys(schema).includes(key)) {
      const validator = new TSBufferValidator(schema as any)
      const res = validator.validate(
        params,
        `${controller}/${service.replace(/^\S/, (s) => s.toUpperCase())}`
      )
      if (!res.isSucc) {
        console.log(res)
        ctx.body = { code: 400, message: res['error'] }
        return
      }
    }

    await next()
  }
}
