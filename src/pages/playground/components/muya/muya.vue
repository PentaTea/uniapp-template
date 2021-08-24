<template>
  <div
    class="container"
    :class="{ loading: muya.loading }"
    :style="cssStr"
    :markdown="muya.markdown"
    :busData="busData"
    :change:busData="handler.editorReceive(busData)"
  >
    <div class="loading-mask"></div>
    <div class="status-bar">
      <div class="status">
        <i class="ri-close-line" @click.stop="() => app.back()"></i>
        <ul>
          <li>{{ muya.fileInfo.name }}</li>
          <li>{{ muya.wordCount }} 字</li>
          <li style="width: 9em;text-align: center;">
            {{ stateDoc }}
          </li>
          <!-- <li @click.stop="hashBus.trigger('dropMenu')">
            <i class="ri-menu-line"></i>
          </li> -->
        </ul>
      </div>
    </div>
    <div id="editor"></div>
    <div id="editor-float-container"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from '@app/mixins'
import { initData, stateDocText } from './init'
import { createBus } from '@app/utils/HashBus'

@Component({
  components: {},
})
export default class extends Vue {
  muya = initData()
  @Provide() hashBus = createBus()
  busData = {}
  get stateDoc() {
    return stateDocText[this.muya.stateDoc]
  }
  update(data) {
    this.$set(this.muya, data.property, data.value)
  }
  receive(data) {
    this.hashBus.receive(data)
  }
  mounted() {
    this.hashBus.set({
      name: 'App',
      postHandler: (massage) => (this.busData = massage),
    })
  }
  get cssStr() {
    let str = ''
    const css = {
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
    }
    for (const key in css) str += '--' + key + ':' + css[key] + 'px;'
    return str
  }
}
</script>

<script module="handler" lang="renderjs">
import Muya from './muya/lib'
import './muya/themes/default.css'
import './muya/index.css'

import TablePicker from './muya/lib/ui/tablePicker'
import QuickInsert from './muya/lib/ui/quickInsert'
import CodePicker from './muya/lib/ui/codePicker'
import EmojiPicker from './muya/lib/ui/emojiPicker'
import ImagePathPicker from './muya/lib/ui/imagePicker'
import ImageSelector from './muya/lib/ui/imageSelector'
import FormatPicker from './muya/lib/ui/formatPicker'
import FrontMenu from './muya/lib/ui/frontMenu'

Muya.use(TablePicker)
Muya.use(QuickInsert)
Muya.use(CodePicker)
Muya.use(EmojiPicker)
Muya.use(ImagePathPicker)
Muya.use(ImageSelector)
Muya.use(FormatPicker)
Muya.use(FrontMenu)

import {createBus} from '@app/utils/HashBus'
window.hashBus = createBus()

export default {
  data() {
    return {
      //#ifdef APP-PLUS
      muya: new Proxy(
        {},
        {
          set: (target, property, value, receiver) => (
            this.$ownerInstance.callMethod('update', { property, value }), true
          ),
        }
      ),
      //#endif
      instance: null,
    }
  },
  computed: {},
  mounted() {
    hashBus.set({
      name: 'Editor',
      postHandler: massage => this.$ownerInstance.callMethod('receive', massage)
    })
    setTimeout(() => hashBus.postMessage('echo','检测链接'),10)
    const muya = new Muya(document.querySelector('#editor'), {
      markdown: '',
      // ...options
    })
    muya.on('change', (change) => {
      this.muya.wordCount = change.wordCount.character
      this.muya.markdown = change.markdown
    })
    muya.on('selectionChange', (e) => {
      //焦点跟随滚动
      document.getElementById(e.end.key)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    muya.on('muya-float', (e) => {
      this.muya.loading = false
      //收回键盘
      if (e.name == 'ag-quick-insert' && e.status) window.plus && window.plus.key.hideSoftKeybord()
    })

    this.instance = muya
  },
  methods: {
    editorReceive(data){
      hashBus.receive(data)
    }
  },
}
</script>

<style lang="scss" scoped>
@import './muya.override';

.container {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: calc(var(--statusBarHeight) + 56px);

  .loading-mask {
    position: fixed;
    z-index: 99999;
    pointer-events: none;
    background: #fff;
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
    @include inset0;
  }

  &.loading .loading-mask {
    opacity: 1;
  }
}

.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 750rpx;
  height: calc(var(--statusBarHeight) + 56px);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);

  .status {
    position: fixed !important;
    top: var(--statusBarHeight) !important;
    display: flex;
    width: 100%;
    height: 28px;
    color: var(--iconColor);
    align-items: center;
    justify-content: space-between;

    > i {
      display: flex;
      float: left;
      width: 35px;
      height: 28px;
      margin: 0 2px;
      font-size: 24px;
      color: var(--iconColor);
      align-items: center;
      justify-content: space-around;
    }

    ul {
      display: flex;
      padding: 0 7px;
      margin: 0;

      li {
        position: relative;
        display: flex;
        height: 28px;
        padding: 0 8px;
        font-size: 12px;
        list-style: none;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
