import _ from 'lodash'
export default () => {
  global['_' as any] = require('../utils/lodash')
}

declare global {
  const _: typeof _
}
