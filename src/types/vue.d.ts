import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $op: {
      set(path: string | string[], value: any): any
      get(path: string | string[]): any
      has(path: string | string[]): any
      insert(path: string | string[], start: number, ...items: any[]): any
      remove(path: string | string[], start: number, deleteCount: number): any
      empty(path: string | string[]): any
      delete(path: string | string[]): any
      push(path: string | string[], ...value: any[]): any
      pop(path: string | string[]): any
      shift(path: string | string[]): any
      unshift(path: string | string[], ...value: any[]): any
      splice(path: string | string[], start: number, deleteCount: number, ...items: any[]): any
      coalesce(...path: (string | string[])[]): any
    }
  }
}
