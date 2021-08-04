import { createModule } from 'vuex-class-component'

import { Theme } from '@app/enums'

export class Global extends createModule({
  namespaced: 'global',
}) {
  rootFontSize = 16

  navData = {
    height: 44,
    statusBarHeight: 22,
  }
}
