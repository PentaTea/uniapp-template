import { userCollection, PublicErrorCode } from '../utils/config'

async function bindEmail({ uid, email, code }) {
  email = email && email.trim()
  if (!email) {
    return {
      code: PublicErrorCode.PARAM_REQUIRED,
      messageValues: {
        param: '邮箱',
      },
    }
  }
  if (!code) {
    return {
      code: PublicErrorCode.PARAM_REQUIRED,
      messageValues: {
        param: '验证码',
      },
    }
  }
  const { emailToLowerCase } = this._getConfig()
  if (emailToLowerCase) {
    email = email.toLowerCase()
  }
  let userList = await userCollection
    .where({
      email,
      email_confirmed: 1,
    })
    .get()
  userList = this._getCurrentAppUser(userList.data)
  if (userList && userList.length > 0) {
    return {
      code: 60201,
      messageValues: {
        type: '邮箱',
      },
    }
  }
  if (code) {
    const verifyRes = await this.verifyCode({
      email,
      code,
      type: 'bind',
    })
    if (verifyRes.code !== 0) {
      return verifyRes // 验证失败
    }
  }
  await userCollection.doc(uid).update({
    email,
    email_confirmed: 1,
  })

  return {
    code: 0,
    msg: '',
    email,
  }
}

export default bindEmail
