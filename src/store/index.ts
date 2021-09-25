import { Global, User, log } from '@app/store/module'
import { generator } from '@app/store/helper'

export const Module = {
  Global,
  User,
  log,
}

const { ModuleList, store } = generator(Module)
export default ModuleList
export { store }
