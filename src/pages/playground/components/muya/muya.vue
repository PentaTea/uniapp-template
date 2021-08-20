<template>
  <div
    class="container"
    :css="css"
    :change:css="editor.useCssVar(css)"
    :markdown="log(muya.markdown)"
    :style="{
      opacity: muya.loading ? 0 : 1,
    }"
  >
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
import { Vue, Component, Watch } from '@app/mixins'
import { initData, stateDocText } from './init'

@Component({
  components: {},
})
export default class extends Vue {
  muya = initData()
  css = {}
  get stateDoc() {
    return stateDocText[this.muya.stateDoc]
  }
  update(data) {
    this.$set(this.muya, data.property, data.value)
  }
  mounted() {
    this.css = { statusBarHeight: uni.getSystemInfoSync().statusBarHeight }
  }
}
</script>

<script module="editor" lang="renderjs">
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
console.log(createBus());

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
    const muya = new Muya(document.querySelector('#editor'), {
      markdown: 'Welcome to use muya.....',
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
    useCssVar(target, option) {
      var { element = document.body, prefix = '--', unit = 'px' } = option || {}
      for (const key in target)
        if (Object.prototype.hasOwnProperty.call(target, key))
          element.style.setProperty(prefix + key, target[key] + unit)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './muya.override';

.container {
  padding-top: calc(var(--statusBarHeight) + 56px);
  transition: all 1s cubic-bezier(0.18, 0.89, 0.32, 1);
  transition-delay: 1s;
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
