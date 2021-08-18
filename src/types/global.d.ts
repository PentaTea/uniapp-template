declare global {
  //全局属性
  interface App {}
  const app: App
  const wx: any

  namespace UniApp {
    interface Uni {
      addInterceptor(name: string, options: UniApp.InterceptorOptions): void
    }
  }

  namespace UniCloud {
    interface Db {
      on: Function
      off: Function
    }
  }

  //扩展window
  interface Window {
    uni: UniApp.Uni
    app: App
  }

  //工具type
  type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
  type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

  type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
  type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>
}

export {}
