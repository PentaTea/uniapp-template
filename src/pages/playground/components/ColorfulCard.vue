<template>
  <div class="flex-center flex-direction">
    <div
      class="relative"
      :style="{
        height,
        width,
        'border-radius': radius,
        opacity,
        transition: 'all 0.5s ease-in-out',
      }"
    >
      <div
        class="shadow"
        :style="{
          filter: 'blur(' + blur + ')',
          'border-radius': radius,
          background: `linear-gradient(to left, ${colorVal[0]}, ${colorVal[1]})`,
        }"
      ></div>
      <div
        class="card"
        :style="{
          'border-radius': radius,
          background: `radial-gradient(
      farthest-corner at 30% 20%, ${colorVal[0]} 0%, ${colorVal[1]} 100%)`,
        }"
      >
        <div
          :style="{
            background: `radial-gradient(farthest-corner at 100% 0,${app
              .color(colorVal[0])
              .brighter(1)
              .alpha(0.7)
              .css()} 0%,transparent 100%)`,
          }"
        ></div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <!-- <text v-if="analysis">
      {{ analysis }}
    </text> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from '@app/mixins'
import is from 'is'
const hue = ['red', ' orange', ' yellow', ' green', ' blue', ' purple', ' pink']

function shuffle(target) {
  let m = target.length
  let i
  while (m) {
    i = (Math.random() * m--) >>> 0
    ;[target[m], target[i]] = [target[i], target[m]]
  }
  return [...target]
}

@Component({
  components: {},
})
export default class extends Vue {
  @Prop({ default: '' }) width: string
  @Prop({ default: '' }) height: string
  @Prop({ default: '20rpx' }) blur: string
  @Prop({ default: '30rpx' }) radius: string
  @Prop({ default: 0 }) delay: number
  //color 接收一个两个元素的元祖
  //默认自动生成离散乱序随机临近色元祖
  @Prop({
    default: () => [],
  })
  color: Array<string>

  colorVal = ['#fff', '#fff']

  get opacity() {
    return this.colorVal[0] != '#fff' && this.enable ? 1 : 0
  }

  enable = false

  mounted() {
    setTimeout(async () => {
      if (!is.empty(this.color)) this.colorVal = this.color
      if (is.empty(app.temp?.['randomcolor_hue'])) app.temp['randomcolor_hue'] = shuffle(hue)
      const colorHue = app.temp['randomcolor_hue'].shift()
      var color
      var count = 0
      do {
        count++
        color = app
          .randomcolor({
            hue: colorHue,
            luminosity: 'light',
            count: 2,
          })
          .map((e) =>
            app
              .color(e)
              .brighter(0.2)
              .hex()
          )
      } while (
        (count < 100 && app.color.contrast(color[0], color[1]) > 1.7) ||
        app.color.distance(color[0], color[1]) > 40 ||
        app.color.deltaE(color[0], color[1]) > 25 ||
        app.color.deltaE(color[0], color[1]) < 7 ||
        app.color(color[0]).hsl()[2] > 0.8 ||
        app.color(color[1]).hsl()[2] > 0.8
      )
      color.push(count)
      this.colorVal = color
    }, 0)
    setTimeout(() => (this.enable = true), this.delay)
  }
  // get analysis() {
  //   return `对比度${app.color.contrast(this.colorVal[0], this.colorVal[1]).toFixed(2)}
  //     \n距离${app.color.distance(this.colorVal[0], this.colorVal[1]).toFixed(2)}
  //     \n色差${app.color.deltaE(this.colorVal[0], this.colorVal[1]).toFixed(2)}
  //     \n饱和${app
  //       .color(this.colorVal[0])
  //       .hsl()[1]
  //       .toFixed(2)}
  //     \n亮度${app
  //       .color(this.colorVal[0])
  //       .hsl()[2]
  //       .toFixed(2)}
  //     \n次数${this.colorVal[2]}`
  // }
}
</script>

<style lang="scss" scoped>
.shadow {
  position: absolute;
  @include inset0;

  opacity: 0.75;
  transform: translate(-2%, 5%) scaleX(0.97);
}

.card {
  position: absolute;
  @include inset0;

  overflow: hidden;

  div {
    position: absolute;
    @include inset0;
  }
}

.content {
  position: relative;
  color: #fff;
}
</style>
