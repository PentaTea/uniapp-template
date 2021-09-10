import { initData } from './utils'
import { Context } from '@app/utils/HashBus'
import { WaterWave } from './common/waterRipple'

export default function(this: {
  muya: ReturnType<typeof initData>
  $ownerInstance: any
  instance: any
}) {
  const hashBus = window.hashBus
  const muya = window.muya
  const events: { [k: string]: (c: Context) => any } = {
    波纹: (context) => {
      const wave = new WaterWave()
      wave.init({
        el: context.data.content,
        backColor: '#e0e4f2',
      })
    },
    删除缩进: () => {
      const { start } = this.muya.selection
      const unindentType = muya.contentState.isUnindentableListItem(start.block)
      if (unindentType) {
        muya.contentState.unindentListItem(start.block, unindentType)
      }
    },
    增加缩进: () => {
      if (muya.contentState.isIndentableListItem()) {
        muya.contentState.indentListItem()
      }
    },
    撤销: () => muya.undo(),
    重做: () => muya.redo(),
  }
  for (const key in events) hashBus.use(key, events[key])
}
