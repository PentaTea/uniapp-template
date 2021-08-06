import { Router } from '@app/enums'
import qs from 'qs'
import { debounce } from 'lodash'

export default {
  to: debounce(
    (path: string, obj?: any) => {
      if (!path.startsWith('/')) {
        const currentPath = [...getCurrentPages()].pop()['route'].split('/')
        let pathArray = path.split('/')
        switch (pathArray.length) {
          case 1:
            pathArray = ['', currentPath[0], currentPath[1], pathArray[0]]
            break
          case 2:
            pathArray = ['', currentPath[0], pathArray[0], pathArray[1]]
            break
        }
        path = pathArray.join('/')
      }

      const querystr = qs.stringify(obj, { encode: false })
      console.log(`to ${path}`, obj ? `\n` : '', obj || '', obj ? `\n=> ${querystr}` : '')
      ;(uni as any).navigateTo({
        url: path + '?' + querystr,
        fail: (err) => console.log(err),
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
        console.log('pages.ts')
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
