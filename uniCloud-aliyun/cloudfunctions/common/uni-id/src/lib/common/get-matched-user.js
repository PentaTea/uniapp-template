/**
 * 根据用户列表获取匹配的用户，登录用接口
 * @param {Array} userList 数据库内查询到的用户列表
 * @param {Object[]} filterList 匹配规则
 * @param {string} filterList[].field 需要匹配的字段
 * @param {string} filterList[].value 需要匹配的字段值
 * @param {string} filterList[].fallbackValue 需要匹配的字段值
 * @returns {Object} 返回值，包含错误信息或被筛选出的用户
 */

export default function getMatchedUser(userList, filterList) {
  if (userList.length === 0) {
    return {
      code: 10002,
    }
  }
  let userMatched
  const userClassified = {}
  const fallbackValueMatchedMap = {}
  for (let i = userList.length - 1; i >= 0; i--) {
    const user = userList[i]
    for (let j = 0; j < filterList.length; j++) {
      const { field, value, fallbackValue } = filterList[j]
      if (value && user[field] === value) {
        userClassified[field] = user
        userList.splice(i, 1)
      } else if (fallbackValue && user[field] === fallbackValue) {
        if (!userClassified[field]) {
          userClassified[field] = user
        }
        fallbackValueMatchedMap[field] = true
        userList.splice(i, 1)
      }
    }
  }
  const userClassifiedKeys = Object.keys(userClassified)
  let fieldMatched
  switch (userClassifiedKeys.length) {
    case 0:
      userMatched = userList[0]
      userList.splice(0, 1)
      break
    case 1:
      fieldMatched = userClassifiedKeys[0]
      userMatched = userClassified[fieldMatched]
      break
    default:
      return {
        code: 10003,
        messageValues: {
          target: '用户',
        },
      }
  }
  if (userList.length > 0) {
    return {
      code: 10003,
      messageValues: {
        target: '用户',
      },
    }
  }
  return {
    code: 0,
    msg: '',
    userMatched,
    fieldMatched,
    isFallbackValueMatched: fieldMatched ? fallbackValueMatchedMap[fieldMatched] : false,
  }
}
