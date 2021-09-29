import { Service } from 'uni-cloud-router'
export default class TestService extends Service {
  echo(data) {
    console.log(_.VERSION)
    return data
  }
}
