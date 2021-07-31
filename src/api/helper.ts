import { axios } from '@app/request'
import { post } from '@api'

export function generator(requestList) {
  uni.post = new Proxy(requestList, {
    get: function(target, property) {
      return (data) => {
        return axios.post(target[property], data)
      }
    },
  }) as any
}

declare global {
  namespace UniApp {
    interface Uni {
      post: {
        [K in keyof typeof post]: (...args: any[]) => Promise<any>
      }
    }
  }
}
