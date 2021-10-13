<script lang="ts">
import Vue from 'vue'
import { store } from '@app/store'
import cloudInit from '@app/common/cloudInit'

export default Vue.extend({
  mpType: 'app',
  store,
  onLaunch() {
    console.log('onLaunch')
    uni.hideTabBar()
    cloudInit()
  },
  onLoad() {
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

<style>
uni-left-window {
  display: block !important;
}

body.sidebar-show::before {
  content: none !important;
}
</style>

<style lang="scss">
// #ifndef APP-PLUS-NVUE
//color-ui
@import 'styles/color-ui-custom.css';
@import 'styles/color-ui-main-theme.css';
@import 'styles/color-ui-animation.css';
@import 'styles/color-ui-icon.css';
@import 'styles/remixicon.css';

// 自定义工具类
@import 'styles/tools.scss';

// 自定义主题
@import 'styles/themes/index.scss';

//富文本
@import 'styles/mpHtml.scss';

// #endif

// #ifdef H5
#webpack-dev-server-client-overlay {
  display: none;
}

uni-page-body {
  height: 100%;
}
// #endif
</style>
