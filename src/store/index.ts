import { Global, User } from '@app/store/module'
import { SetModule } from './set'

export const Module = {
  Global,
  User,
}

const { ModuleList, store } = SetModule(Module)
export default ModuleList
export { store }
