import { userCollection } from '../utils/config'

const db = uniCloud.database()
async function loginByQQ({ code, accessToken, myInviteCode, needPermission, role, type } = {}) {
  const clientPlatform = this.context.PLATFORM
  const isMpQQ = clientPlatform === 'mp-qq'
  const { openid, unionid, sessionKey } = await this._getQQApi()[
    isMpQQ ? 'code2Session' : 'getOpenidByToken'
  ]({
    code,
    accessToken,
  })
  if (!openid) {
    return {
      code: 10801,
      messageValues: {
        account: 'qq openid',
      },
    }
  }

  const result = {
    accessToken,
    sessionKey,
  }
  const dbCmd = db.command
  const queryUser = [
    {
      qq_openid: {
        [clientPlatform]: openid,
      },
    },
  ]
  if (unionid) {
    queryUser.push({
      qq_unionid: unionid,
    })
  }
  let userList = await userCollection.where(dbCmd.or(...queryUser)).get()
  userList = this._getCurrentAppUser(userList.data)
  // openid 或 unionid已注册
  if (userList && userList.length > 0) {
    if (type === 'register') {
      return {
        code: 10802,
        messageValues: {
          type: this.t('qq-account'),
        },
      }
    }
    const userMatched = userList[0]

    const extraData = {
      qq_openid: {
        [clientPlatform]: openid,
      },
    }
    if (unionid) {
      extraData.qq_unionid = unionid
    }

    const loginExecRes = await this._loginExec(userMatched, {
      needPermission,
      extraData,
    })

    if (loginExecRes.code !== 0) {
      return loginExecRes
    }

    const { userInfo } = loginExecRes

    return {
      ...loginExecRes,
      openid,
      unionid,
      ...result,
      mobileConfirmed: userInfo.mobile_confirmed === 1,
      emailConfirmed: userInfo.email_confirmed === 1,
    }
  } else {
    if (type === 'login') {
      return {
        code: 10803,
        messageValues: {
          type: this.t('qq-account'),
        },
      }
    }
    const user = {
      qq_openid: {
        [clientPlatform]: openid,
      },
      qq_unionid: unionid,
    }
    user.my_invite_code = myInviteCode
    user.role = role

    const registerExecResult = await this._registerExec(user)
    if (registerExecResult.code !== 0) {
      return registerExecResult
    }
    return {
      ...registerExecResult,
      openid,
      unionid,
      ...result,
      mobileConfirmed: false,
      emailConfirmed: false,
    }
  }
}

export default loginByQQ
