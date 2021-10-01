export default class extends Controller {
  echo() {
    console.log($data)
    return $service.test.echo($data)
  }

  return() {
    return $data
  }

  @debug('装饰器测试函数')
  async decorator(e) {
    await new Promise((resolve) => {
      setTimeout(resolve, 2333)
    })
    return 123
  }

  validate() {
    return $data.title
  }
}
export interface validate {
  title?: {
    a: string
  }
}

function debug(commit: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    //构造代理函数
    descriptor.value = async function (...args: any[]) {
      console.log('--- ' + commit + ' ---')
      const start = +new Date()
      // 显示参数列表
      args = args.map((arg) => String(arg))
      console.log('参数: ' + args)
      try {
        // 调用原函数
        return await method.apply(this, args)
        // eslint-disable-next-line no-useless-catch
      } catch (e) {
        throw e
      } finally {
        const end = +new Date()
        console.log(`--- 运行完毕: ${end - start}ms ---`)
      }
    }
    return descriptor
  }
}
