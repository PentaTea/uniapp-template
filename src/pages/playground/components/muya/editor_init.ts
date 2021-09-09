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

import { createBus, HashBus } from '@app/utils/HashBus'
const hashBus = createBus()
window.hashBus = hashBus
declare global {
  interface Window {
    hashBus: HashBus
    muya: any
    plus: typeof plus
  }
}

import createMethods from './editor_events'
import { initData } from './utils'

import { nanoid } from 'nanoid'

export default function(this: {
  muya: ReturnType<typeof initData>
  $ownerInstance: any
  instance: any
}) {
  hashBus.set({
    name: 'Editor',
    postHandler: (massage) => this.$ownerInstance.callMethod('logicReceive', massage),
  })
  setTimeout(() => hashBus.postMessage('echo', '检测链接'), 10)
  const muya = new Muya(document.querySelector('#editor'), {
    markdown: '',
    imagePathPicker: () => {
      const id = nanoid()
      return new Promise((resolve, reject) => {
        hashBus.use('uploadImgData' + id, (context) => {
          console.log(context.data.content)
          if (context.data.content) resolve(context.data.content)
          context.delete()
        })
        hashBus.postMessage('uploadImg', id)
      })
    },
    // ...options
  })
  muya.on('change', (change) => {
    this.muya.wordCount = change.wordCount.character
    this.muya.markdown = change.markdown
    const char = change.toc[0]?.content
    this.muya.fileInfo.name = char && /[\u4e00-\u9fa5(^\\\w)*]/.test(char) ? char : '未命名'
    console.log(change)
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
  //更新指针状态
  muya.on('change', () => {
    this.muya.selection = muya.getSelection()
  })

  muya.container.addEventListener('keydown', () => {
    this.muya.selection = muya.getSelection()
  })

  this.instance = muya
  window.muya = muya

  createMethods.call(this)
}
