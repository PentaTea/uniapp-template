<template>
  <view
    class="tui-tabbar"
    :class="{
      'tui-tabbar-fixed': isFixed,
      'tui-unlined': unlined,
      'tui-backdrop__filter': backdropFilter,
    }"
    :style="{ background: backgroundColor, zIndex: isFixed ? zIndex : 'auto' }"
  >
    <block v-for="(item, index) in tabBar" :key="index">
      <view
        class="tui-tabbar-item"
        :class="{ 'tui-item-hump': item.hump }"
        :style="{ backgroundColor: item.hump && !backdropFilter ? backgroundColor : 'none' }"
        @tap="tabbarSwitch(index, item.hump, item.pagePath, item.verify)"
      >
        <view class="tui-icon-box" :class="{ 'tui-tabbar-hump': item.hump }">
          <image
            :src="current == index ? item.selectedIconPath : item.iconPath"
            :class="[item.hump ? '' : 'tui-tabbar-icon']"
          ></image>
          <view
            :class="[item.isDot ? 'tui-badge-dot' : 'tui-badge']"
            :style="{ color: badgeColor, backgroundColor: badgeBgColor }"
            v-if="item.num"
          >
            {{ item.isDot ? '' : item.num }}
          </view>
        </view>
        <view
          class="tui-text-scale"
          :class="{ 'tui-text-hump': item.hump }"
          :style="{ color: current == index ? selectedColor : color }"
          >{{ item.text }}</view
        >
      </view>
    </block>
    <view
      :style="{ background: backgroundColor }"
      :class="{ 'tui-hump-box': hump }"
      v-if="hump && !unlined && !backdropFilter"
    ></view>
  </view>
</template>

<script>
export default {
  name: 'TuiTabbar',
  props: {
    //当前索引
    current: {
      type: Number,
      default: 0,
    },
    //字体颜色
    color: {
      type: String,
      default: '#666',
    },
    //字体选中颜色
    selectedColor: {
      type: String,
      default: '#5677FC',
    },
    //背景颜色
    backgroundColor: {
      type: String,
      default: '#FFFFFF',
    },
    //是否需要中间凸起按钮
    hump: {
      type: Boolean,
      default: false,
    },
    //固定在底部
    isFixed: {
      type: Boolean,
      default: true,
    },
    //tabbar
    // "pagePath": "/pages/my/my", 页面路径
    // "text": "thor", 标题
    // "iconPath": "thor_gray.png", 图标地址
    // "selectedIconPath": "thor_active.png", 选中图标地址
    // "hump": true, 是否为凸起图标
    // "num": 2,   角标数量
    // "isDot": true,  角标是否为圆点
    // "verify": true  是否验证  （如登录）
    tabBar: {
      type: Array,
      default() {
        return []
      },
    },
    //角标字体颜色
    badgeColor: {
      type: String,
      default: '#fff',
    },
    //角标背景颜色
    badgeBgColor: {
      type: String,
      default: '#F74D54',
    },
    unlined: {
      type: Boolean,
      default: false,
    },
    //是否开启高斯模糊效果[仅在支持的浏览器有效果]
    backdropFilter: {
      type: Boolean,
      default: false,
    },
    //z-index
    zIndex: {
      type: [Number, String],
      default: 9999,
    },
  },
  watch: {
    current() {},
  },
  data() {
    return {}
  },
  methods: {
    tabbarSwitch(index, hump, pagePath, verify) {
      this.$emit('click', {
        index: index,
        hump: hump,
        pagePath: pagePath,
        verify: verify,
      })
    },
  },
}
</script>

<style scoped>
.tui-tabbar {
  position: relative;
  display: flex;
  width: 100%;
  height: 100rpx;
  align-items: center;
  justify-content: space-between;
}

.tui-backdrop__filter {
  /* Safari for macOS & iOS */
  -webkit-backdrop-filter: blur(15px);

  /* Google Chrome */
  backdrop-filter: blur(15px);
}

.tui-tabbar-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box !important;
}

.tui-tabbar::before {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: block;
  width: 100%;
  border-top: 1px solid #b2b2b2;
  content: ' ';
  transform: scaleY(0.5) translateZ(0);
  transform-origin: 0 0;
}

.tui-tabbar-item {
  position: relative;
  z-index: 5;
  display: flex;
  height: 100%;
  padding: 10rpx 0;
  text-align: center;
  box-sizing: border-box;
  flex: 1;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
}

.tui-icon-box {
  position: relative;
}

.tui-item-hump {
  height: 98rpx;
}

.tui-tabbar-icon {
  display: block;
  width: 52rpx;
  height: 52rpx;
}

.tui-hump-box {
  position: absolute;
  top: -50rpx;
  left: 50%;
  z-index: 4;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  transform: translateX(-50%);
}

.tui-hump-box::after {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 200%;
  height: 200%;
  border: 1px solid #b2b2b2;
  border-radius: 120rpx;
  content: ' ';
  transform: scale(0.5) translateZ(0);
  box-sizing: border-box;
  transform-origin: 0 0;
}

.tui-unlined::after {
  height: 0 !important;
}

.tui-tabbar-hump {
  position: absolute;
  top: -40rpx;
  left: 50%;
  z-index: 5;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  -webkit-transform: translateX(-50%) rotate(0deg);
  transform: translateX(-50%) rotate(0deg);
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
}

.tui-tabbar-hump image {
  display: block;
  width: 100rpx;
  height: 100rpx;
}

.tui-hump-active {
  -webkit-transform: translateX(-50%) rotate(135deg);
  transform: translateX(-50%) rotate(135deg);
}

.tui-text-scale {
  font-size: 25rpx;
  font-weight: bold;
  line-height: 28rpx;
  transform: scale(0.8);
  transform-origin: center 100%;
}

.tui-text-hump {
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: scale(0.8) translateX(-50%);
  transform-origin: 0 100%;
}

.tui-badge {
  position: absolute;
  top: -5rpx;
  right: 0;
  display: flex;
  height: 32rpx;
  min-width: 20rpx;
  padding: 0 6rpx;
  font-size: 24rpx;
  border-radius: 40rpx;
  transform: translateX(70%);
  align-items: center;
  justify-content: center;
}

.tui-badge-dot {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}
</style>
