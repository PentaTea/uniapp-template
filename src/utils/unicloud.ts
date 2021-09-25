function createContext(name: string, action = []) {
  return new Proxy(() => {}, {
    get: (target, property, receiver) => {
      return createContext(name, [...action, property])
    },
    apply: function(target, thisArg, argumentsList) {
      if (name == 'app') {
        console.log(`[cloud]: 命中控制器路由: ${action.join('/')}`)
      } else console.log(`[cloud]: 命中云函数 ${name}, 执行action: ${action.join('/')}`)

      return new Promise((resolve, reject) => {
        uniCloud.callFunction({
          name: name,
          data: {
            action: action.join('/'),
            params: argumentsList[0],
          },
          success: ({ result }) => resolve(result),
          fail: (err) => reject(err),
        })
      })
    },
  })
}
const cloudfunctionsAlias = {
  user: 'uni-id-cf',
  controller: 'app',
}
export const cloud = (new Proxy(cloudfunctionsAlias, {
  get: (target, property) => createContext(target[property] || property),
}) as unknown) as Record<keyof typeof cloudfunctionsAlias, CF> & { [key: string]: CF }

type CF = {
  (params?: Record<string, any>): Promise<any>
  [key: string]: CF
}

type ss = Record<keyof typeof cloudfunctionsAlias, CF>

export const controller = new Proxy(
  {},
  { get: (target, property) => createContext('app', [property]) }
) as { [key: string]: CF }
