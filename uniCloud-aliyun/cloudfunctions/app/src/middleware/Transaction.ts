export default () => {
  return async function auth(ctx, next) {
    //开始事务
    const transaction = await ctx.db.startTransaction()
    ctx.transaction = transaction
    try {
      await next()
      await transaction.commit() //提交
    } catch (error) {
      await transaction.rollback() //回滚
      throw error
    }
  }
}
