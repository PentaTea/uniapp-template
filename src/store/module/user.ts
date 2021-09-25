import { createModule, action } from 'vuex-class-component'

import { Theme } from '@app/enums'

export class User extends createModule({
  namespaced: 'user',
}) {
  token = ''
  tokenExpired = ''
  userInfo = {} as any

  @action async login() {
    const res = await app.cloud.user.login({ username: '2490445193', password: '1234' })
    this.userInfo = res.userInfo
    this.token = res.token
    this.tokenExpired = res.tokenExpired
  }
}
