const { Service } = require('uni-cloud-router')
module.exports = class TestService extends Service {
  echo(data) {
    return {
      code: 233,
      echo: data,
    }
  }
}
