import { Vue as orgVue, Component, Prop, InjectReactive } from '@app/mixins'
import { initData } from './utils'
import { HashBus } from '@app/utils/HashBus'

@Component({
  components: {},
})
export class Vue extends orgVue {
  @InjectReactive() readonly muya: ReturnType<typeof initData>
  @InjectReactive() readonly hashBus: HashBus
}
export {
  Component,
  Mixins,
  Emit,
  Inject,
  InjectReactive,
  Model,
  ModelSync,
  Prop,
  PropSync,
  Provide,
  ProvideReactive,
  Ref,
  VModel,
  Watch,
} from 'vue-property-decorator'
