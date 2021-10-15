import { userCollection } from '../utils/config'

export async function addUser(user, { needPermission, autoSetDcloudAppid = true } = {}) {
  const config = this._getConfig()
  const addData = {
    ...user,
    dcloud_appid: autoSetDcloudAppid ? [this.context.APPID] : [],
    register_date: Date.now(),
    register_ip: this.context.CLIENTIP,
  }
  const addRes = await userCollection.add(addData)

  const uid = addRes.id

  let tokenInfo
  if (config.removePermissionAndRoleFromToken) {
    tokenInfo = await this.createToken({
      uid,
      needPermission,
    })
  } else {
    const role = user.role || []
    let permission
    if (role.length === 0 || role.includes('admin')) {
      permission = []
    } else {
      permission = await this._getPermissionListByRoleList(role)
    }
    tokenInfo = await this.createToken({
      uid,
      role,
      permission,
    })
  }

  const { token, tokenExpired } = tokenInfo

  await userCollection.doc(uid).update({
    token: [token],
  })

  return {
    token,
    tokenExpired,
    uid,
    type: 'register',
    userInfo: Object.assign({}, addData, { token }),
  }
}

export async function registerExec(user, { needPermission, autoSetDcloudAppid = true } = {}) {
  const { my_invite_code: myInviteCode } = user
  const config = this._getConfig()

  if (config.autoSetInviteCode || myInviteCode) {
    const validResult = await this._getValidInviteCode({
      inviteCode: myInviteCode,
    })
    if (validResult.code) {
      return validResult
    }
    user.my_invite_code = validResult.inviteCode
  }

  const registerResult = await this._addUser(user, {
    needPermission,
    autoSetDcloudAppid,
  })

  return {
    code: 0,
    msg: '',
    ...registerResult,
  }
}
