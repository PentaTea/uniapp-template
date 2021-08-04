import { axios } from '@app/request'
import { post } from '@api'

export function generator(requestList) {
  app.post = new Proxy(requestList, {
    get: function(target, property) {
      return (data) => {
        return axios.post(target[property], data)
      }
    },
  }) as any
}

declare global {
  interface App {
    post: {
      [K in keyof typeof post]: (...args: any[]) => Promise<any>
    }
  }
}
