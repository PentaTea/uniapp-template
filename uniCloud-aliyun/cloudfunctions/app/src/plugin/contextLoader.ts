import { Controller as IController, Service as IService, Context } from 'uni-cloud-router'
export default () => {
  class Controller extends IController {
    constructor(ctx) {
      super(ctx)
      addGlobal('currentContext', ctx)
      addGlobal('$service', ctx.service)
      addGlobal('$controller', ctx.controller)
      addGlobal(
        '$data',
        new Proxy(() => {}, {
          get(target, property) {
            return ctx.data[property]
          },
          apply() {
            return ctx.data
          },
        })
      )
      addGlobal('$db', ctx.db)
    }
  }
  addGlobal('Controller', Controller)
  addGlobal('Service', IService)

  addGlobal('$200', (s) => ({ message: s[0] }))
}

const addGlobal = (s, e) => (global[s] = e)
const names = ['service', 'controller', 'data', 'db']

declare global {
  class Controller extends IController {}
  class Service extends IService {}
  const currentContext: Context
  const $service: Context['service']
  const $controller: Context['controller']

  const $db: Context['db']
  const $data: Context['data'] & (<T = any>() => T)
  const $200: (s) => any
}
