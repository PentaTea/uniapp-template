declare global {
  //工具type
  type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
  type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

  type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
  type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>
}

export {}
