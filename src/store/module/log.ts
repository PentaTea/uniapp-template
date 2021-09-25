import { createModule, action } from 'vuex-class-component'

const ErrorSetting = {
  default: {},
  vue: {},
  script: {},
  promise: {},
  resource: {},
}

export class log extends createModule({
  namespaced: 'log',
}) {
  list: LogInfo[] = []

  async add(info: string, type?: LogInfo['type']): Promise<void>
  async add(info: LogInfo, type?: LogInfo['type']): Promise<void>
  @action async add(info: LogInfo | string, type: LogInfo['type'] = 'info') {
    let item
    if (typeof info === 'string') {
      item = {
        message: info,
        type: 'error',
        time: +new Date(),
      }
    } else {
      item = {
        ...info,
        type,
        time: +new Date(),
      }
    }
    this.list.unshift(item)
  }
}

export interface LogInfo {
  type?: 'error' | 'info' | 'warn'
  // Type of error
  scope?: keyof typeof ErrorSetting
  // Error file
  file?: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail?: string
  // Error url
  url?: string
  // Error time
  time?: string
}
