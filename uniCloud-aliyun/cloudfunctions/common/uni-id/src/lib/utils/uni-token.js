import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { getType } from '../../share'
import { userCollection } from './config'

function getClientUaHash() {
  const hash = crypto.createHash('md5')
  const hashContent = /MicroMessenger/i.test(this.context.CLIENTUA)
    ? this.context.CLIENTUA.replace(/(MicroMessenger\S+).*/i, '$1')
    : this.context.CLIENTUA
  hash.update(hashContent)
  return hash.digest('hex')
}

function createTokenInternal({ signContent, config }) {
  if (
    config.tokenExpiresIn &&
    config.tokenExpiresThreshold &&
    config.tokenExpiresIn <= config.tokenExpiresThreshold
  ) {
    throw new Error(this.t('token-expires-config-warning'))
  }
  if (getType(signContent) !== 'object' || !signContent.uid) {
    return {
      code: 30101,
      messageValues: {
        param: this.t('user-id'),
      },
    }
  }
  if (config.bindTokenToDevice) {
    signContent.clientId = this._getClientUaHash()
  }
  const token = jwt.sign(signContent, config.tokenSecret, {
    expiresIn: config.tokenExpiresIn,
  })

  return {
    token,
    tokenExpired: Date.now() + config.tokenExpiresIn * 1000,
  }
}

function createToken({ uid, needPermission, role, permission }) {
  if (!uid) {
    return {
      code: 30101,
      messageValues: {
        param: this.t('user-id'),
      },
    }
  }
  const originSignContent = {
    uid,
    needPermission,
    role,
    permission,
  }
  const config = this._getConfig()
  if (!this.interceptorMap.has('customToken')) {
    const signContent = { ...originSignContent }
    return this._createTokenInternal({
      signContent,
      config,
    })
  }
  const customToken = this.interceptorMap.get('customToken')
  if (typeof customToken !== 'function') {
    throw new Error(this.t('type-function-required', 'custumToken'))
  }
  const customTokenRes = customToken(originSignContent)
  if (!(customTokenRes instanceof Promise)) {
    return this._createTokenInternal({
      signContent: customTokenRes,
      config,
    })
  }
  return customTokenRes.then((customTokenRes) => {
    return this._createTokenInternal({
      signContent: customTokenRes,
      config,
    })
  })
}

function verifyToken(token) {
  const config = this._getConfig()
  let payload
  try {
    payload = jwt.verify(token, config.tokenSecret)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        code: 30203,
        err: error,
      }
    }
    return {
      code: 30204,
      err: error,
    }
  }
  if (
    config.bindTokenToDevice &&
    payload.clientId &&
    payload.clientId !== this._getClientUaHash()
  ) {
    return {
      code: 30201,
    }
  }
  return {
    code: 0,
    message: '',
    ...payload,
  }
}

async function checkToken(token, { needPermission, needUserInfo = true } = {}) {
  const config = this._getConfig()
  const payload = this._verifyToken(token)
  if (payload.code) {
    return payload
  }

  const { uid, needPermission: needPermissionInToken, role, permission, exp } = payload

  // token?????????role???permission?????????isV2Token
  const isV2Token = role && permission

  needPermission = needPermission === undefined ? needPermissionInToken : needPermission

  // admin???????????????role???permission???token??????????????????????????????????????????????????????admin????????????
  // ??????????????????????????????token??????permission????????????????????????
  const needDBQuery = config.removePermissionAndRoleFromToken || !isV2Token || needUserInfo // ???token?????????????????????????????????????????????

  // ??????????????????token
  const needRefreshToken =
    (!config.removePermissionAndRoleFromToken && !isV2Token) || // ???token?????????
    (config.removePermissionAndRoleFromToken && isV2Token) || // ???token?????????
    (config.tokenExpiresThreshold && exp - Date.now() / 1000 < config.tokenExpiresThreshold) // token????????????

  let userMatched = {}
  if (needDBQuery || needRefreshToken) {
    const userInDB = await userCollection.doc(uid).get()
    if (!userInDB.data || userInDB.data.length === 0 || !userInDB.data[0].token) {
      return {
        code: 30202,
      }
    }
    userMatched = userInDB.data[0]
    if (userMatched.status === 1) {
      return {
        code: 10001,
      }
    }
    let tokenList = userMatched.token
    if (!tokenList) {
      tokenList = []
    } else if (typeof tokenList === 'string') {
      tokenList = [tokenList]
    }
    if (tokenList.indexOf(token) === -1) {
      return {
        code: 30202,
      }
    }
  }
  const result = {
    code: 0,
    uid,
  }

  // ???token????????????token??????role???permission
  if (isV2Token) {
    result.role = role
    result.permission = permission
  }

  if (needUserInfo) {
    result.userInfo = userMatched
  }

  // ???token???????????????permission?????????
  let currentRole
  let currentPermission
  if ((!isV2Token && needPermission) || needRefreshToken) {
    currentRole = result.role = userMatched.role || []
    if (currentRole.length === 0 || currentRole.includes('admin')) {
      currentPermission = result.permission = []
    } else {
      currentPermission = result.permission = await this._getPermissionListByRoleList(result.role)
    }
    // ??????????????????????????????????????????
    if (needPermission) {
      result.role = currentRole
      result.permission = currentPermission
    }
  }
  // ???????????????token????????????????????????????????????????????????????????????token
  if (needRefreshToken) {
    let newTokeninfo
    if (config.removePermissionAndRoleFromToken) {
      newTokeninfo = await this.createToken({
        uid,
        needPermission: needPermissionInToken,
      })
    } else {
      newTokeninfo = await this.createToken({
        uid,
        role: currentRole,
        permission: currentPermission,
      })
    }
    // ????????????token??????????????????
    let tokenList = userMatched.token
    if (!tokenList) {
      tokenList = []
    } else if (typeof tokenList === 'string') {
      tokenList = [tokenList]
    }
    const expiredToken = this._getExpiredToken(tokenList)
    tokenList = tokenList.filter((item) => {
      return expiredToken.indexOf(item) === -1
    })
    tokenList.push(newTokeninfo.token)
    await userCollection.doc(uid).update({
      token: tokenList,
      last_login_date: Date.now(),
      last_login_ip: this.context.CLIENTIP,
    })
    return {
      ...result,
      ...newTokeninfo,
    }
  }

  return result
}
function getExpiredToken(tokenList) {
  const config = this._getConfig()
  const tokenExpired = []
  tokenList.forEach((token) => {
    try {
      jwt.verify(token, config.tokenSecret)
    } catch (error) {
      tokenExpired.push(token)
    }
  })
  return tokenExpired
}

export {
  verifyToken,
  createToken,
  checkToken,
  getExpiredToken,
  getClientUaHash,
  createTokenInternal,
}
