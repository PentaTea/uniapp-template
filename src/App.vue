<script lang="ts">
import Vue from 'vue'
import { store } from '@app/store'

export default Vue.extend({
  mpType: 'app',
  store,
  onLaunch() {
    console.log('onLaunch')
    uni.hideTabBar()
  },
  onShow() {
    console.log('onShow')
    uni.hideTabBar()
  },
  onHide() {
    console.log('onHide')
  },
})
</script>

<!-- 这个空style不能删,抑制报错 -->
<style></style>

<style lang="scss">
// #ifndef APP-PLUS-NVUE

//color-ui
@import 'styles/color-ui-custom.css';
@import 'styles/color-ui-main-theme.css';
@import 'styles/color-ui-animation.css';

/* @import 'styles/color-ui-icon.css' */

// 自定义工具类
@import 'styles/tools.scss';

// 自定义主题
@import '~@app/styles/themes/index.scss';

// #endif
</style>
