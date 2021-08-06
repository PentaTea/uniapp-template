import { createModule } from 'vuex-class-component'

import { Theme } from '@app/enums'

export class User extends createModule({
  namespaced: 'user',
}) {
  token = ''
  tokenExpired = ''
}
