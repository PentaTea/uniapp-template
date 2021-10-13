import { createModule, action } from 'vuex-class-component'

export class User extends createModule({
  namespaced: 'user',
}) {
  token = ''
  tokenExpired = ''
  userInfo = {} as any

  @action async login() {
    const res = await app.cloud.user.login({ username: 'PentaTea', password: 'zjp11679841' })
    this.userInfo = res.userInfo
    this.token = res.token
    this.tokenExpired = res.tokenExpired
  }
}
