import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.locale('zh-cn')

export { dayjs }
