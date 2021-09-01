import { initData } from './utils'

export default function(this: {
  muya: ReturnType<typeof initData>
  $ownerInstance: any
  instance: any
}) {
  const hashBus = window.hashBus
  const muya = window.muya
  const events = {
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
  }
  for (const key in events) hashBus.use(key, events[key])
}
