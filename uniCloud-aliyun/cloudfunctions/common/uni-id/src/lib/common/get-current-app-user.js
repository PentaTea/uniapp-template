/**
 * 根据用户列表获取当前客户端应用匹配的用户
 * @param {Array} userList 数据库内查询到的用户列表
 * @returns {Object} 返回值，包含错误信息或被筛选出的用户
 */

export default function getCurrentAppUser(userList) {
  const dcloudAppid = this.context.APPID
  return userList.filter((item) => {
    // 空数组不允许登录
    return (
      !item.delete_at &&
      (item.dcloud_appid === undefined ||
        item.dcloud_appid === null ||
        item.dcloud_appid.indexOf(dcloudAppid) > -1)
    )
  })
}
