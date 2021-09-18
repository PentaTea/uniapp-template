const { Controller } = require('uni-cloud-router')
module.exports = class HelloController extends Controller {
  echo() {
    const { ctx, service } = this
    console.log(ctx.data)
    return this.service.test.echo(ctx.data)
  }
}
