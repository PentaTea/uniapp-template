class RunClass {
  name: string
  constructor(name) {
    this.name = name
  }
  run() {
    uniCloud.callFunction({
      name: this.name,
      data: {
        action: 'login',
        params: {
          username: '2490445193',
          password: '1234',
        },
      },
      success: ({ result }) => {
        console.log(result)
      },
    })
  }
}

function createContext(name: string, action = []) {
  return new Proxy(() => {}, {
    get: (target, property, receiver) => {
      return createContext(name, [...action, property])
    },
    apply: function(target, thisArg, argumentsList) {
      if (name == 'app') {
        console.log(`[cloud]: 命中控制器路由: ${action.join('/')}`)
      } else console.log(`[cloud]: 命中云函数 ${name}, 执行action: ${action.join('/')}`)

      return new Promise((resolve) => {
        uniCloud.callFunction({
          name: name,
          data: {
            action: action.join('/'),
            params: argumentsList[0],
          },
          success: ({ result }) => {
            resolve(result)
          },
        })
      })
    },
  })
}

export const cloud = new Proxy(
  {
    user: 'uni-id-cf',
    controller: 'app',
  },
  { get: (target, property) => createContext(target[property] || property) }
)

export const controller = new Proxy(
  {},
  { get: (target, property) => createContext('app', [property]) }
)
