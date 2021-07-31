export default {
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
}
