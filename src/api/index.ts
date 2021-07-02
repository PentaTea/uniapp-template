import { axios } from '@app/request'
import { AxiosResponse } from 'axios'

const post = {
  /**
   * @获取用户信息
   */
  getUser: '/getUser',
}

uni.post = new Proxy(post, {
  get: function(target, property) {
    return (data) => {
      return axios.post(target[property], data)
    }
  },
}) as any

declare global {
  namespace UniApp {
    interface Uni {
      post: {
        [K in keyof typeof post]: (...args: any[]) => Promise<AxiosResponse<any>>
      }
    }
  }
}

export {}
