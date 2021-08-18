<template>
  <BasePage>
    <div class="cu-form-group margin-top">
      <div class="title">userId</div>
      <input type="number" placeholder="请输入本机userId" v-model="userId" />
    </div>
    <div class="cu-form-group">
      <div class="title">目标Id</div>
      <input type="number" placeholder="请输入对方userId" v-model="targetId" />
      <div class="cu-btn bg-gradual-orange" @click="call">
        发起呼叫
      </div>
    </div>
    <div class="padding">
      <text class="text-lg text-content">
        {{
          '1. 必须在onLoad中执行初始化相关逻辑,在此之前必须获得appid,key,userid\n 2.uniapp中需要使用refs策略来获得rtc组件实例,大写组件名有可能会导致获取失败\n 3.要确保当前小程序appId开通了live-pusher的能力,否则会报权限错误'
        }}
      </text>
    </div>
    <div class="margin-top trtc">
      <trtc ref="trtc" id="trtc" :config="config" backgroundMute></trtc>
    </div>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import { genTestUserSig } from './trtc_debug/GenerateTestUserSig'
const Signature = genTestUserSig('')
wx.$globalData = {
  userInfo: null,
  headerHeight: 0,
  statusBarHeight: 0,
  sdkAppID: Signature.sdkAppID,
  userID: '',
  userSig: '',
  token: '',
  expiresIn: '',
  phone: '',
  sessionID: '',
}
@Component({
  components: {},
})
export default class extends Vue {
  userId = String(Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 2)))
  targetId = ''

  call() {
    if (this.userId == this.targetId) {
      wx.showToast({
        icon: 'none',
        title: '不可呼叫本机',
      })
      return
    }
    this.TRTCCalling.call({ userID: this.targetId, type: 2 })
  }

  data = {
    userIDToSearch: '',
    searchResultShow: false,
    invitee: null,
    config: {
      sdkAppID: wx.$globalData.sdkAppID,
      userID: this.userId,
      userSig: wx.$globalData.userSig,
      type: 2,
    },
  }

  TRTCCalling: any = null
  config: any = {}

  onLoad() {
    const Signature = genTestUserSig(this.userId)
    console.log('audio----config', wx.$globalData)
    const config = {
      sdkAppID: wx.$globalData.sdkAppID,
      userID: this.userId,
      userSig: Signature.userSig,
    }
    this.config = { ...this.data.config, ...config }
    this.$nextTick(() => {
      this.TRTCCalling = this.$refs['trtc']
      console.log(this.TRTCCalling)
      this.bindTRTCCallingRoomEvent()
      this.TRTCCalling.login()
    })
  }

  onUnload() {
    // 取消监听事件
    this.unbindTRTCCallingRoomEvent()
    // 退出登录
    this.TRTCCalling.logout()
  }

  invitedEvent() {}

  hangupEvent() {}

  rejectEvent() {
    wx.showToast({
      title: '对方已拒绝',
    })
  }

  userLeaveEvent() {}
  onRespEvent() {
    wx.showToast({
      title: '对方不在线',
    })
    this.TRTCCalling.hangup()
  }

  callingTimeoutEvent() {
    wx.showToast({
      title: '无应答超时',
    })
  }

  lineBusyEvent() {
    wx.showToast({
      title: '对方忙线中',
    })
    this.TRTCCalling.hangup()
  }

  callingCancelEvent() {
    wx.showToast({
      title: '通话已取消',
    })
  }

  userEnterEvent() {}

  callEndEvent() {
    wx.showToast({
      title: '通话结束',
    })
    this.TRTCCalling.hangup()
  }

  bindTRTCCallingRoomEvent() {
    const TRTCCallingEvent = this.TRTCCalling.EVENT
    this.TRTCCalling.on(TRTCCallingEvent.INVITED, this.invitedEvent)
    // 处理挂断的事件回调
    this.TRTCCalling.on(TRTCCallingEvent.HANG_UP, this.hangupEvent)
    this.TRTCCalling.on(TRTCCallingEvent.REJECT, this.rejectEvent)
    this.TRTCCalling.on(TRTCCallingEvent.USER_LEAVE, this.userLeaveEvent)
    this.TRTCCalling.on(TRTCCallingEvent.NO_RESP, this.onRespEvent)
    this.TRTCCalling.on(TRTCCallingEvent.CALLING_TIMEOUT, this.callingTimeoutEvent)
    this.TRTCCalling.on(TRTCCallingEvent.LINE_BUSY, this.lineBusyEvent)
    this.TRTCCalling.on(TRTCCallingEvent.CALLING_CANCEL, this.callingCancelEvent)
    this.TRTCCalling.on(TRTCCallingEvent.USER_ENTER, this.userEnterEvent)
    this.TRTCCalling.on(TRTCCallingEvent.CALL_END, this.callEndEvent)
  }
  unbindTRTCCallingRoomEvent() {
    const TRTCCallingEvent = this.TRTCCalling.EVENT
    this.TRTCCalling.off(TRTCCallingEvent.INVITED, this.invitedEvent)
    this.TRTCCalling.off(TRTCCallingEvent.HANG_UP, this.hangupEvent)
    this.TRTCCalling.off(TRTCCallingEvent.REJECT, this.rejectEvent)
    this.TRTCCalling.off(TRTCCallingEvent.USER_LEAVE, this.userLeaveEvent)
    this.TRTCCalling.off(TRTCCallingEvent.NO_RESP, this.onRespEvent)
    this.TRTCCalling.off(TRTCCallingEvent.CALLING_TIMEOUT, this.callingTimeoutEvent)
    this.TRTCCalling.off(TRTCCallingEvent.LINE_BUSY, this.lineBusyEvent)
    this.TRTCCalling.off(TRTCCallingEvent.CALLING_CANCEL, this.callingCancelEvent)
    this.TRTCCalling.off(TRTCCallingEvent.USER_ENTER, this.userEnterEvent)
    this.TRTCCalling.off(TRTCCallingEvent.CALL_END, this.callEndEvent)
  }
}
</script>

<style lang="scss" scoped>
.trtc {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
