const softDelete = ['uni-id-users']
const $ = uniCloud.database().command
module.exports = {
  // 在数据库操作之前执行
  before: async (state, event) => {
    //特定表单中执行软删除策略
    if (softDelete.includes(state.collection)) {
      if (state.type == 'delete') {
        //检测到删除方法,改为软删除
        state.type = 'update'
        event.command.$db.forEach((element, i) => {
          //查找删除方法并更新删除时间,参数为真则判断为软删除
          if (element.$method == 'remove' && element.$param[0])
            event.command.$db[i] = { $method: 'update', $param: [{ delete_at: +new Date() }] }
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
  },
  // 在数据库操作之后执行
  after: async (state, event, error, result) => {
    return result
  },
}
