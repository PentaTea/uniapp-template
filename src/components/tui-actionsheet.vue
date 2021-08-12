<template>
  <view @touchmove.stop.prevent>
    <view
      class="tui-actionsheet"
      :class="{ 'tui-actionsheet-show': show, 'tui-actionsheet-radius': radius }"
    >
      <view
        class="tui-actionsheet-tips"
        :style="{ fontSize: size + 'rpx', color: color }"
        v-if="tips"
      >
        {{ tips }}
      </view>
      <view :class="[isCancel ? 'tui-operate-box' : '']">
        <block v-for="(item, index) in itemList" :key="index">
          <view
            class="tui-actionsheet-btn tui-actionsheet-divider"
            :class="{ 'tui-btn-last': !isCancel && index == itemList.length - 1 }"
            hover-class="tui-actionsheet-hover"
            :hover-stay-time="150"
            :data-index="index"
            :style="{ color: item.color || '#2B2B2B' }"
            @tap="handleClickItem"
          >
            <rich-text :nodes="item.text"></rich-text>
          </view>
        </block>
      </view>
      <view
        class="tui-actionsheet-btn tui-actionsheet-cancel"
        hover-class="tui-actionsheet-hover"
        :hover-stay-time="150"
        v-if="isCancel"
        @tap="handleClickCancel"
        >取消</view
      >
    </view>
    <view
      class="tui-actionsheet-mask"
      :class="{ 'tui-mask-show': show }"
      @tap="handleClickMask"
    ></view>
  </view>
</template>

<script>
export default {
  name: 'TuiActionsheet',
  props: {
    //点击遮罩 是否可关闭
    maskClosable: {
      type: Boolean,
      default: true,
    },
    //显示操作菜单
    show: {
      type: Boolean,
      default: false,
    },
    //菜单按钮数组，自定义文本颜色，红色参考色：#e53a37
    itemList: {
      type: Array,
      default: function() {
        return [
          {
            text: '确定',
            color: '#2B2B2B',
          },
        ]
      },
    },
    //提示文字
    tips: {
      type: String,
      default: '',
    },
    //提示文字颜色
    color: {
      type: String,
      default: '#808080',
    },
    //提示文字大小 rpx
    size: {
      type: Number,
      default: 26,
    },
    //是否需要圆角
    radius: {
      type: Boolean,
      default: true,
    },
    //是否需要取消按钮
    isCancel: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleClickMask() {
      if (!this.maskClosable) return
      this.handleClickCancel()
    },
    handleClickItem(e) {
      if (!this.show) return
      const index = Number(e.currentTarget.dataset.index)
      this.$emit('click', {
        index: index,
        ...this.itemList[index],
      })
    },
    handleClickCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped>
.tui-actionsheet {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  min-height: 100rpx;
  background-color: #f7f7f7;
  visibility: hidden;
  transform: translate3d(0, 100%, 0);
  transition: all 0.25s ease-in-out;
  transform-origin: center;
}

.tui-actionsheet-radius {
  overflow: hidden;
  border-top-right-radius: 20rpx;
  border-top-left-radius: 20rpx;
}

.tui-actionsheet-show {
  visibility: visible;
  transform: translate3d(0, 0, 0);
}

.tui-actionsheet-tips {
  display: flex;
  width: 100%;
  padding: 40rpx 60rpx;
  text-align: center;
  background-color: #fff;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}

.tui-operate-box {
  padding-bottom: 12rpx;
}

.tui-actionsheet-btn {
  position: relative;
  display: flex;
  width: 100%;
  height: 100rpx;
  font-size: 34rpx;
  text-align: center;
  background-color: #fff;
  align-items: center;
  justify-content: center;
}

.tui-btn-last {
  padding-bottom: env(safe-area-inset-bottom);
}

.tui-actionsheet-divider::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-top: 1rpx solid #e7e7e7;
  content: '';
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.tui-actionsheet-cancel {
  padding-bottom: env(safe-area-inset-bottom);
  color: #1a1a1a;
}

.tui-actionsheet-hover {
  background-color: #f7f7f9;
}

.tui-actionsheet-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9996;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.tui-mask-show {
  opacity: 1;
  visibility: visible;
}
</style>
