import { utils } from './index'

type utilsType = typeof utils
declare global {
  interface App extends utilsType {}
}
if (window) {
  Object.assign(window, {
    uni,
    app,
    _,
  })
}
