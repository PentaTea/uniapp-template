<template>
  <div>
    <div class="fab">
      <div class="list" :style="{ height: showList * 700 + 'rpx' }"></div>
    </div>
    <div
      class="mask flex-center flex-direction"
      :style="{
        'backdrop-filter': `blur(${showWindow * 10}rpx)`,
        background: `rgba(0, 0, 0, 0.${showWindow * 3})`,
        'pointer-events': showWindow || showList ? 'auto' : 'none',
      }"
    >
      <div
        class="tip margin-bottom text-white"
        :style="{
          opacity: showWindow,
        }"
        >{{ item && item.tip ? item.tip : hit }}</div
      >
      <div
        class="container"
        :style="{
          opacity: showWindow,
        }"
      >
        <div v-for="(row, i) in actionList" :key="i" class="row flex">
          <div
            v-for="(item, actionName) in row"
            :key="actionName"
            :data-action="actionName"
            :data-default="actionName === 'default'"
            class="flex-center flex-direction padding-sm"
            :class="item.class"
            :style="{ flex: item.flex }"
          >
            <i v-if="item.icon" :class="item.icon + (item.text ? '' : ' single')"></i>
            <text v-if="item.text">{{ item.text }}</text>
            <div v-if="actionName == '个人信息'" class="flex align-center width100">
              <div
                class="cu-avatar radius"
                style="background-image: url('https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg');"
              ></div>
              <div class="margin-left-sm">
                <div class="text-df">海星人</div>
                <div class="text-gray text-cut text-xs">
                  这里写个人信息
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pointer"
        :style="{
          opacity: showWindow,
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from '@app/mixins'

@Component({
  components: {},
})
export default class extends Vue {
  showWindow = 0
  showList = 0
  openWindow() {
    this.showWindow = 1
    uni.vibrateShort({})
  }
  closeWindow() {
    this.showWindow = 0
  }
  openList() {
    this.showList = 1
  }
  closeList() {
    this.showList = 0
  }
  showMask = false
  @Watch('showWindow') showMaskCtrl(newVal) {
    if (newVal) this.showMask = true
    else setTimeout(() => (this.showMask = false), 800)
  }

  hit = ''

  get item() {
    return this.actionList.find((e) => e[this.hit])?.[this.hit]
  }

  change(e) {
    this.hit = e
  }

  submit() {}

  get actionList() {
    return [
      ...this.actions,
      {
        帮助: {
          icon: 'ri-question-mark',
          text: '帮助',
        },
        default: {
          flex: 1,
          text: this.hit == 'default' ? '松手取消选择,向左滑动显示帮助' : '滑动到此处取消',
          tip: '松手取消选择',
        },
      },
      {
        分享: {
          flex: 1,
          icon: 'ri-share-line',
          class: 'horizontal',
          text: '分享给小伙伴',
        },
      },
    ]
  }

  actions = [
    {
      个人信息: {
        flex: 1,
      },
      反馈: {
        icon: 'ri-bug-fill',
        text: '反馈',
      },
      设置: {
        icon: 'ri-settings-fill',
      },
    },
    {
      扫二维码: {
        icon: 'ri-qr-scan-2-line',
      },
      消息通知: {
        text: '0 条新消息',
        icon: 'ri-chat-3-fill',
        flex: 1,
      },
      我的收藏: {
        text: '12 个收藏夹',
        icon: 'ri-heart-3-fill',
        flex: 1,
      },
    },
  ]
}
</script>

<script module="handler" lang="renderjs">
import Hammer from 'hammerjs'
export default {
    data() {
        return {
            showList: false,
            showWindow: false,
            fab: {
                $el: null,
                touches: null,
            },
            mask: {
                $el: null,
                touches: null,
            },
            list: {
                $el: null,
                touches: null,
            },
            items: [],
            pointer: {
                $el: null,
                position: {
                    startX: null,
                    startY: null,
                    x: 0,
                    y: 0,
                },
            }
        }
    },
    watch: {
        showWindow(newVal) {
            if (newVal) {
                this.showList = false
                this.pointer.position.x = 0
                this.pointer.position.y = 0
                this.$ownerInstance.callMethod('openWindow')
            } else {
                this.$ownerInstance.callMethod('closeWindow')
            }
        },
        showList(newVal) {
            if (newVal) {
                this.showWindow = false
                this.$ownerInstance.callMethod('openList')
            } else {
                this.$ownerInstance.callMethod('closeList')
            }
        },
        pointer: {
            handler(e) {
                if (!e.$el) return
                const el = e.$el
                el.style.left = e.position.startX + 'px'
                el.style.top = e.position.startY + 'px'
                el.style.transform = this.translate(e.position.x, e.position.y)
                let min = Number.MAX_SAFE_INTEGER
                let index = null
                this.items.forEach((item,i) => {
                  const d = distance({x:e.position.startX+e.position.x,y:e.position.startY+e.position.y},item.rect)
                  if (d<min) {
                    index = i
                    min = d
                  }
                })
                this.items.forEach((item,i) => {
                  if(index == i) {
                    item.$el.classList.add('checked')
                    this.$ownerInstance.callMethod('change',item.$el.dataset.action)
                  }
                  else item.$el.classList.remove('checked')
                })
            },
            deep: true,
        }
    },
    mounted() {
        //指针和容器元素绑定
        this.pointer.$el = this.$ownerInstance.$el.querySelector('.pointer')
        console.log(this.$ownerInstance.$el.querySelector('.container').children);
        for (let el of this.$ownerInstance.$el.querySelectorAll('.container [data-action]')) {
            const rect = el.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            }
            this.items.push({ $el: el, rect, center });
            if (el.dataset.default) {
                this.pointer.position.startX = center.x
                this.pointer.position.startY = center.y
            }
        }
        // fab事件绑定
        this.fab.$el = this.$ownerInstance.$el.querySelector('.fab')
        this.fab.touches = new Hammer(this.fab.$el)
        this.fab.touches.get('pan').set({ direction: Hammer.DIRECTION_ALL })
        this.fab.touches.get('press').set({ time: 200 })
        this.fab.touches.on('panstart', (ev) => {
            this.fab.$el.style.transform = this.translate(0, 0, 1)
        });
        this.fab.touches.on('panmove', (ev) => {
            let x = Math.atan(ev.deltaX / 100) * 20
            let y = Math.atan(ev.deltaY / 100) * 20
            let s = Math.atan(ev.distance / 100) / 10
            this.fab.$el.style.transform = this.translate(x, y, 1 - s)
            if (this.list.$el) this.list.$el.style.transform = this.translate(x / 10, y / 3, 1 - s / 10)
            this.list.$el.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1),height 0.5s cubic-bezier(0.18, 0.89, 0.32, 1)'
            this.pointer.position.x = ev.deltaX * 1.2
            this.pointer.position.y = ev.deltaY * 1.4
            if (this.showWindow == false && this.showList == false && ev.direction === Hammer.DIRECTION_UP && ev.offsetDirection === Hammer.DIRECTION_UP && ev.distance >= 10) {
                this.showList = true
            }
        });
        this.fab.touches.on('panend', (ev) => {
            this.showWindow = false
            this.fab.$el.style.transform = this.translate(0, 0)
            this.list.$el.style.transition = 'transform 3s cubic-bezier(0.18, 0.89, 0.32, 1),height 0.5s cubic-bezier(0.18, 0.89, 0.32, 1)'
            if (this.list.$el) this.list.$el.style.transform = this.translate(0, 0)
        });
        this.fab.touches.on('press', (ev) => {
            this.showWindow = true
        });
        this.fab.touches.on('pressup', (ev) => {
            this.showWindow = false
            this.$ownerInstance.callMethod('submit')
        });
        // mask事件绑定
        this.mask.$el = this.$ownerInstance.$el.querySelector('.mask')
        this.mask.touches = new Hammer(this.mask.$el)
        this.mask.touches.on('tap', (ev) => {
            this.showWindow = false
            this.showList = false
        });
        // list事件绑定
        this.list.$el = this.$ownerInstance.$el.querySelector('.list')
        this.list.touches = new Hammer(this.list.$el)
    },
    methods: {
        translate(x, y, s = 1) {
            return `translate(${x}px,${y}px) scale(${s})`
        },
    }
}

function inside(point, box) {
    return (point.x > box.left && point.x < box.right && point.y > box.top && point.y < box.bottom)
}

function distance_aux(p, lower, upper) {
    if (p < lower) return lower - p
    if (p > upper) return p - upper
    else return 0
}

function distance(point, box) {
    const dx = distance_aux(point.x, box.left, box.right)
    const dy = distance_aux(point.y, box.top, box.bottom)
    if (inside(point, box)) return Math.min(dx, dy)    // or 0 in case of distance from the area
    else return Math.sqrt(dx * dx + dy * dy)
}
</script>

<style lang="scss" scoped>
.fab {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  z-index: 99999;
  width: 250rpx;
  height: 150rpx;
  background: #fff;
  border-radius: 16rpx;
  transform: translate(0, 0) scale(1);
  transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
  // border: 1rpx solid var(--alpha-dark-90);
}

.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99998;
  transition: all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1);

  .tip {
    height: 50rpx;
    transition: all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1);
  }

  .container {
    width: 600rpx;
    padding-bottom: 500rpx;
    // background: #fff;
    opacity: 0;
    transition: all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1);

    .row + .row {
      margin-top: 36rpx;
    }

    div[data-action] + div[data-action] {
      margin-left: 36rpx;
    }

    div[data-action] {
      height: 130rpx;
      min-width: 130rpx;
      font-size: 24rpx;
      color: #6e6e6e;
      background: #fff;
      // border: 1rpx solid var(--alpha-dark-90);
      border-radius: 16rpx;
      transform: scale(1);
      transition: transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);

      &.checked {
        background: #fafafa;
        transform: scale(1.05);
        transition: transform 0.15s cubic-bezier(0.66, 0.98, 0.59, 1.63);
      }

      &:not(.horizontal) {
        i {
          font-size: 36rpx;

          &.single {
            font-size: 42rpx;
          }
        }

        i + text {
          margin-top: 12rpx;
        }
      }

      &.horizontal {
        flex-direction: row;

        i {
          font-size: 42rpx;
        }

        text {
          font-size: 28rpx;
        }

        i + text {
          margin-top: 0;
          margin-left: 12rpx;
        }
      }
    }
  }

  .pointer {
    position: fixed;
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1);

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 32rpx;
      height: 32rpx;
      background: #bebebe;
      border: 1rpx solid #5f5f5f;
      border-radius: 50%;
      content: '';
      opacity: 0.5;
      transform: translate(-50%, -50%);
    }
  }
}

.list {
  position: absolute;
  bottom: calc(100% + 16rpx);
  width: 250rpx;
  height: 700rpx;
  background: #fff;
  border-radius: 16rpx;
  // border: 1rpx solid var(--alpha-dark-90);
  transition: height 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
}
</style>
