import is from 'is'

export default {
  set(target, property, value, storeName) {
    console.log('[vuex]', storeName, property, value)
    save(target, property, value, storeName)
    target[property] = value
    return true
  },
  get(target, property, storeName) {
    if (is.empty(target[property])) {
      const r = restore(target, property, storeName)
      if (r !== undefined) {
        target[property] = r
        console.log('[restore]', target[property])
      }
    }
    return target[property]
  },
}

const Cache = {}
const symbol = '__vuex'
uni.getStorageInfo({
  success: async (res) => {
    res.keys.forEach((key) => {
      //key is vuex.storeName.property
      const n = key.split('.')
      if (n.shift() != symbol) return
      Cache[n.join('.')] = uni.getStorageSync(key)
    })
  },
})

async function save(target, property, value, storeName) {
  if (target.__noCache) return
  uni.setStorageSync(`__vuex.${storeName}.${property}`, value)
}
function restore(target, property, storeName) {
  if (target.__noCache || !is.string(property)) return null
  else return Cache[[storeName, property].join('.')]
}
