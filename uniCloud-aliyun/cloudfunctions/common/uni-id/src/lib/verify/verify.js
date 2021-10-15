import { log, getSmsCode } from '../../share/index'
import { verifyCollection } from '../utils/config'

const db = uniCloud.database()

export async function setVerifyCode({ mobile, email, code, expiresIn, type }) {
  email = email && email.trim()
  mobile = mobile && mobile.trim()
  if (email) {
    const { emailToLowerCase } = this._getConfig()
    if (emailToLowerCase) {
      email = email.toLowerCase()
    }
  }
  if (!mobile && !email) {
    return {
      code: 50101,
      messageValues: {
        param: '手机号或邮箱',
      },
    }
  }
  if (mobile && email) {
    return {
      code: 50102,
      messageValues: {
        param: '参数',
        reason: '手机号和邮箱不可同时存在',
      },
    }
  }
  if (!code) {
    code = getSmsCode()
  }
  if (!expiresIn) {
    expiresIn = 180 // 默认180s过期时间
  }
  const now = Date.now()
  const record = {
    mobile,
    email,
    type,
    code,
    state: 0,
    ip: this.context.CLIENTIP,
    created_at: now,
    expired_at: now + expiresIn * 1000,
  }

  const addRes = await verifyCollection.add(record)
  log('addRes', addRes)
  return {
    code: 0,
    mobile: mobile,
    email: email,
  }
}

export async function verifyCode({ mobile, email, code, type }) {
  email = email && email.trim()
  mobile = mobile && mobile.trim()
  if (email) {
    const { emailToLowerCase } = this._getConfig()
    if (emailToLowerCase) {
      email = email.toLowerCase()
    }
  }
  if (!mobile && !email) {
    return {
      code: 50201,
      messageValues: {
        param: '手机号或邮箱',
      },
    }
  }
  if (mobile && email) {
    return {
      code: 50203,
      messageValues: {
        param: '参数',
        reason: '手机号和邮箱不可同时存在',
      },
    }
  }
  const dbCmd = db.command
  const now = Date.now()
  const query = {
    mobile,
    email,
    type,
    code,
    state: 0,
    expired_at: dbCmd.gt(now),
  }
  const record = await verifyCollection.where(query).orderBy('created_at', 'desc').limit(1).get()

  log('verifyRecord:', record)

  if (record && record.data && record.data.length > 0) {
    // 验证通过
    const matched = record.data[0]
    // 状态改为已验证
    const upRes = await verifyCollection.doc(matched._id).update({
      state: 1,
    })
    log('upRes', upRes)
    return {
      code: 0,
      msg: '验证通过',
    }
  } else {
    return {
      code: 50202,
      msg: '验证码错误或已失效',
    }
  }
}
