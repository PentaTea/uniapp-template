import { Controller as IController, Service as IService, Context } from 'uni-cloud-router'
export default () => {
  class Controller extends IController {
    constructor(ctx) {
      super(ctx)
      addGlobal('currentContext', ctx)
      addGlobal('$service', ctx.service)
      addGlobal('$controller', ctx.controller)
      addGlobal('$data', ctx.data)
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
  const $data: Context['data']
  const $db: Context['db']

  const $200: (s) => any
}
