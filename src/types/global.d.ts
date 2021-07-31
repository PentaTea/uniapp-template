import lodash from 'lodash'
declare global {
  //全局属性
  interface App {}
  const app: App
  const _: typeof lodash

  //扩展window
  interface Window {
    uni: UniApp.Uni
    app: App
    _: typeof lodash
  }

  //工具type
  type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
  type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

  type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
  type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>
}

export {}
