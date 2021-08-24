interface Pkg {
  name: string
  handle?: number
  content?: any
  from?: string
  timestamp?: number
}

interface Options {
  name?: string
  postHandler?(massage: any): void
  origin?(receive: HashBus['receive']): void
}
interface Context {
  data: Pkg
  send: HashBus['postMessage']
  instance: InstanceType<typeof HashBus>
  delete: ReturnType<HashBus['delete']['bind']>
}

type Middleware = (context: Context, next: HashBus['next']) => void
type Command = Middleware

export class HashBus {
  name?: string
  private chain: Array<Middleware>
  private index: number
  private quere: Array<Pkg>
  private command: { [key: string]: Command }
  lastMessage: Pkg
  postHandler?(massage: Pkg): void
  constructor(options?: Options) {
    if (options) this.set(options)
    this.chain = [] // 存放中间件的数组
    this.index = 0 // 当前中间件在数组中的位置
    this.quere = [] //消息队列
    this.command = {} //指令逻辑存放
  }
  set(options: Options): InstanceType<typeof HashBus> {
    options.origin && options.origin(this.receive.bind(this))
    this.postHandler = options.postHandler || this.postHandler
    this.name = options.name || this.name
    return this
  }
  use(handle: Middleware): InstanceType<typeof HashBus>
  use(name: string, handle: Middleware): InstanceType<typeof HashBus>
  use(...arg: [Middleware] | [string, Middleware]): InstanceType<typeof HashBus> {
    if (typeof arg[0] === 'string' && arg[1]) this.command[arg[0]] = arg[1]
    else if (typeof arg[0] !== 'string' && arg[0].name) this.command[arg[0].name] = arg[0]
    else if (typeof arg[0] !== 'string' && !arg[0].name) this.chain.push(arg[0])
    return this
  }
  delete(name: string) {
    delete this.command[name]
  }
  receive(msg: Pkg) {
    if (this.lastMessage && this.lastMessage.timestamp == msg.timestamp) return
    this.lastMessage = msg
    this.quere.push(msg)
    this.next()
  }
  receiveJson(j: Pkg) {
    console.log(j)

    this.receive(j)
  }
  injectContext(data: Pkg): Context {
    return {
      data,
      send: this.postMessage.bind(this),
      instance: this,
      delete: this.delete.bind(this, this.quere[0].name),
    }
  }
  next() {
    //判断中间件正常执行完毕
    if (this.index > this.chain.length - 1) {
      if (this.quere[0].name)
        this.command[this.quere[0].name] &&
          this.command[this.quere[0].name](this.injectContext(this.quere[0]), () => {})
      this.quere.shift()
      this.index = 0
      if (this.quere.length) this.next()
      return
    }
    const middleware = this.chain[this.index]
    this.index++
    middleware(this.injectContext(this.quere[0]), this.next.bind(this))
    // 程序进行到这里有两种情况
    // 1.队列中所有消息的所有中间件进行完毕并退出递归,并且已经归零,下方操作无效
    // 2.消息被中间件阻止继续冒泡,需要出队并归零指针,判断消息队列进行下一条信息的冒泡
    if (!this.quere.length) return
    this.quere.shift()
    this.index = 0
    if (this.quere.length) this.next()
  }
  pack<T>(massage: Pkg | string, content?: T, handle?: number) {
    var p = {} as Pkg
    if (typeof massage === 'string' && !content && !handle) p = { name: massage }
    else if (typeof massage === 'string' && content && !handle) p = { name: massage, content }
    else if (typeof massage === 'string' && content && handle)
      p = { name: massage, content, handle }
    else if (typeof massage !== 'string') p = { ...massage }
    return p
  }
  postMessage(massage: Pkg): void
  postMessage(name: string): void
  postMessage<T>(name: string, content: T): void
  postMessage<T>(name: string, content: T, handle: number): void
  postMessage<T>(massage: Pkg | string, content?: T, handle?: number) {
    if (!this.postHandler) throw new Error(this.name + ': 请先注入postHandler')
    this.postHandler({
      timestamp: +new Date(),
      ...this.pack(massage, content, handle),
      from: this.name,
    })
  }
  trigger(massage: Pkg): void
  trigger(name: string): void
  trigger<T>(name: string, content: T): void
  trigger<T>(name: string, content: T, handle: number): void
  trigger<T>(massage: Pkg | string, content?: T, handle?: number) {
    this.receive({
      ...this.pack(massage, content, handle),
      from: this.name,
    })
  }
}

export function createBus() {
  const hashBus = new HashBus()
  hashBus
    .use('echo', (context) => {
      console.log(`[hashBus] 接收到echo请求,开始反向传输数据:`, context.data.content)
      context.send({ ...context.data, name: 'log' })
    })
    .use('log', (context) => {
      console.log(
        `[hashBus] ${context.data.from} => ${context.instance.name}\n`,
        context.data.content
      )
    })
  // .use((context, next) => {
  //   console.log('这是一个中间件,可以拦截或者代理数据包传输', context)
  //   next()
  // })

  return hashBus
}
