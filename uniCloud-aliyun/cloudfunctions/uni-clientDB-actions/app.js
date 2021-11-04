const softDelete = ['uni-id-users']
const $ = uniCloud.database().command
const DEBUG = true
module.exports = {
  // 在数据库操作之前执行
  before: async (state, event) => {
    console.log(event)
    //特定表单中执行软删除策略
    if (softDelete.includes(state.collection)) {
      console.log(111111111)
      if (state.type == 'delete') {
        t`检测到删除操作`
        state.type = 'update'
        event.command.$db.forEach((element, i) => {
          if (
            element.$method == 'remove' &&
            ['hard', 'force'].every((e) => element.$param[0] !== e)
          ) {
            t`查找到删除方法,并判断为软删除`
            event.command.$db[i] = {
              $method: 'update',
              $param: [
                {
                  delete_at: +new Date(),
                  delete_from: element.$param[0],
                  delete_uid: state.auth.uid,
                },
              ],
            }
          }
        })
      } else if (state.command.getMethod('where').length) {
        //
        state.command.getMethod('where').forEach((e, i) => {
          state.command.setParam({
            name: 'where',
            index: i,
            param: [$.and([{ delete_at: $.eq(null) }, ...e.$param])],
          })
        })
      } else if (event.command.$db.length == 2)
        event.command.$db.splice(1, 0, {
          $method: 'where',
          $param: [{ delete_at: $.eq(null) }],
        })
    }
    console.log(event)
  },
  // 在数据库操作之后执行
  after: async (state, event, error, result) => {
    return result
  },
}

function t(s) {
  if (DEBUG) console.error(s[0])
}
