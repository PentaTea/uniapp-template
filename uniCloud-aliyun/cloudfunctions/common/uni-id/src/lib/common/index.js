import _getWeixinApi from './weixin-api'
import _getQQApi from './qq-api'
import _getAlipayApi from './alipay-api'
import _getValidInviteCode from './get-valid-invite-code'
import _loginExec from './login-exec'
import { addUser as _addUser, registerExec as _registerExec } from './register-exec'
import _getMatchedUser from './get-matched-user'
import _getCurrentAppUser from './get-current-app-user'

import { setAuthorizedAppLogin, authorizeAppLogin, forbidAppLogin } from './multi-end'

export {
  _getAlipayApi,
  _getValidInviteCode,
  _addUser,
  _loginExec,
  _registerExec,
  _getWeixinApi,
  _getQQApi,
  _getMatchedUser,
  _getCurrentAppUser,
  setAuthorizedAppLogin,
  authorizeAppLogin,
  forbidAppLogin,
}
