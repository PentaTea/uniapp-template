import { userCollection } from '../utils/config'

const db = uniCloud.database()
async function loginByWeixin(params) {
  if (typeof params === 'string') {
    params = {
      code: params,
    }
  }

  const { needPermission, platform, code, myInviteCode, role, type } = params

  const clientPlatform = platform || this.context.PLATFORM
  const isMpWeixin = clientPlatform === 'mp-weixin'
  const {
    openid,
    unionid,
    sessionKey,
    accessToken,
    refreshToken,
    expired: accessTokenExpired,
  } = await this._getWeixinApi({
    platform: clientPlatform,
  })[isMpWeixin ? 'code2Session' : 'getOauthAccessToken'](code)
  if (!openid) {
    return {
      code: 10401,
      messageValues: {
        account: '微信openid',
      },
    }
  }

  let result
  if (isMpWeixin) {
    result = {
      sessionKey,
    }
  } else {
    result = {
      accessToken,
      refreshToken,
      accessTokenExpired,
    }
  }
  const dbCmd = db.command
  const queryUser = [
    {
      wx_openid: {
        [clientPlatform]: openid,
      },
    },
  ]
  if (unionid) {
    queryUser.push({
      wx_unionid: unionid,
    })
  }
  let userList = await userCollection.where(dbCmd.or(...queryUser)).get()
  userList = this._getCurrentAppUser(userList.data)
  // openid 或 unionid已注册
  if (userList && userList.length > 0) {
    if (type === 'register') {
      return {
        code: 10402,
        messageValues: {
          type: this.t('wechat-account'),
        },
      }
    }
    const userMatched = userList[0]

    const extraData = {
      wx_openid: {
        [clientPlatform]: openid,
      },
    }
    if (unionid) {
      extraData.wx_unionid = unionid
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
        code: 10403,
        messageValues: {
          type: this.t('wechat-account'),
        },
      }
    }
    const user = {
      wx_openid: {
        [clientPlatform]: openid,
      },
      wx_unionid: unionid,
    }
    user.my_invite_code = myInviteCode
    user.role = role

    const registerExecResult = await this._registerExec(user, {
      needPermission,
    })
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

export default loginByWeixin
