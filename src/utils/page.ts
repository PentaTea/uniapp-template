import { Router } from '@app/enums'
import qs from 'qs'
import { debounce } from 'lodash'

export default {
  to: debounce(
    (path: string, obj?: any) => {
      const querystr = qs.stringify(obj, { encode: false })
      console.log(`to ${path}`, obj ? `\n` : '', obj || '', obj ? `\n=> ${querystr}` : '')
      ;(uni as any).navigateTo({
        url: path + '?' + querystr,
      })
    },
    500,
    { leading: true, trailing: false }
  ),
  back: debounce(
    (data?: any, name = 'callbackData') => {
      var pages = getCurrentPages()

      if (data && !data.preventDefault && !data.timeStamp) {
        console.log('回调:', data, '->', name)
        var prevPage: any = pages[pages.length - 2]
        if (prevPage) prevPage.$vm.$op.set(name, data)
      }

      if (pages.length > 1) (uni as any).navigateBack({})
      else {
        ;(uni as any).switchTab({
          url: Router.INDEX,
        })
      }
    },
    500,
    { leading: true, trailing: false }
  ),
  callback: (data: any, name = 'callbackData') => {
    var pages = getCurrentPages()

    if (data && !data.preventDefault && !data.timeStamp) {
      console.log('回调:', data, '->', name)
      var prevPage: any = pages[pages.length - 2]
      if (prevPage) prevPage.$vm.$op.set(name, data)
    }
  },
}
