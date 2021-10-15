// @ts-ignore
import schema from 'uniCloud-aliyun/cloudfunctions/app/src/schema/gen.json'

function createContext(name: string, action = []) {
  return new Proxy(() => {}, {
    get: (target, property, receiver) => {
      return createContext(name, [...action, property])
    },
    apply: function (target, thisArg, argumentsList) {
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
//调用普通云函数
export const cloud = new Proxy(cloudfunctionsAlias, {
  get: (target, property) => createContext(target[property] || property),
}) as unknown as Record<keyof typeof cloudfunctionsAlias, CF> & { [key: string]: CF }

type CF = {
  (params?: Record<string, any>): Promise<any>
  [key: string]: CF
}

//调用 app 云函数
export const controller = new Proxy(
  {},
  { get: (target, property) => createContext('app', [property]) }
) as UnionToIntersection<MatchController<typeof schema>> & {
  [key: string]: { [key: string]: (arg?: Record<string, any>) => Promise<any> }
}

//工具类型 将url与长短参表的映射转换为流式调用异步函数类型
// a['/b/c'] = {d:e} =>> a.b.c({d?:any}).then
type MatchController<S extends { [key: string]: object }> = keyof S extends infer L //利用约束创建临时变量 L
  ? L extends `${infer A}/${infer B}` //约束 L 必须为 '/控制器名/方法名' 的形式,并创建相应变量
    ? {
        //控制器名
        [K in A]: {
          //方法名
          [key in B]: (arg?: Record<string, any>) => Promise<any> //创建异步函数类型,规定参数1的key映射为对应url的短签
        } & { [key: string]: (arg?: Record<string, any>) => Promise<any> }
      }
    : never
  : never

// 工具类型 将联合类型转为交叉类型
// a|b =>> a&b
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

export const db = uniCloud.database().action('app')

declare global {
  namespace UniCloud {
    interface DocumentReference {
      remove(type?: boolean): any
    }
  }
}
