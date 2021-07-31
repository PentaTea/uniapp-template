import { Global, User } from '@app/store/module'
import { generator } from '@app/store/helper'

export const Module = {
  Global,
  User,
}

const { ModuleList, store } = generator(Module)
export default ModuleList
export { store }
