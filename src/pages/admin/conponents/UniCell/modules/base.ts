import { Vue, Component, Prop, InjectReactive } from 'vue-property-decorator'
@Component({})
export default class extends Vue {
  @Prop() name: string
  @Prop() type: string
  @InjectReactive() data!: Record<string, any>
  @Prop({ default: () => ({}) }) readonly options!: Record<string, any>
  @Prop({ default: null }) _schema?: Record<string, any>

  get field() {
    return (
      Object.entries(this._schema).find((e) => e[1] == this.name || e[1].label == this.name)?.[0] ||
      this.options.field ||
      (console.error(`请为 [${this.name}] 模块提供字段名`), 'Unknown_Field:' + this.name)
    )
  }

  get value() {
    return this.data[this.field]
  }

  set value(val) {
    this.$set(this.data, this.field, val)
  }
}
