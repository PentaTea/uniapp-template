import { getDistinctArray } from '../../share/index'
import { roleCollection, permissionCollection } from './config'

const db = uniCloud.database()
const dbCmd = db.command

async function getPermissionListByRoleList(roleList) {
  if (!Array.isArray(roleList)) {
    return []
  }
  if (roleList.length === 0) {
    return []
  }
  if (roleList.includes('admin')) {
    const permissionRecord = await permissionCollection.limit(500).get()
    return permissionRecord.data.map((item) => item.permission_id)
  }
  const roleRecord = await roleCollection
    .where({
      role_id: dbCmd.in(roleList),
    })
    .get()
  const permission = []
  roleRecord.data.forEach((item) => {
    Array.prototype.push.apply(permission, item.permission)
  })
  return getDistinctArray(permission)
}

export { getPermissionListByRoleList }
