import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.locale('zh-cn')
import { Router } from '@app/enums'

var mixin = {
  toast(str: string) {
    // #ifdef APP-PLUS
    plus.nativeUI.toast(str)
    // #endif
    // #ifndef APP-PLUS
    uni.showToast({
      title: str,
      icon: 'none',
      position: 'bottom',
    })
    // #endif
  },
  time: dayjs,
  back() {
    if (getCurrentPages().length > 1) uni.navigateBack({})
    else
      uni.switchTab({
        url: Router.INDEX,
      })
  },
}

Object.keys(mixin).forEach((key) => {
  ;(uni as any)[key] = mixin[key as keyof typeof mixin]
})
type mixinType = typeof mixin
declare global {
  namespace UniApp {
    interface Uni extends mixinType {}
  }
}

export {}
