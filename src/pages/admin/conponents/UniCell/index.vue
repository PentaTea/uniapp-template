<template>
  <div>
    <template v-for="(e, i) in use || elFormUse || $attrs">
      <span
        v-if="{ ...options, ...pack(e) }.label !== false && !elFormUse"
        class="label"
        :key="'label_' + i"
      >
        {{ { ...options, ...pack(e) }.label || i.split(':').pop() }}
      </span>
      <component
        :is="getModules(i.split(':')[0]) || 'NotFound'"
        :key="i"
        :name="i.split(':').pop() || (elFormItem && elFormItem.label)"
        :type="i.split(':')[0]"
        :options="{
          style: { width: elFormItem ? '100%' : 'unset' },
          ...options,
          field: elFormItem && elFormItem.prop,
          ...pack(e),
        }"
        :_schema="_schema"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  ProvideReactive,
  ModelSync,
  Inject,
  Watch,
} from 'vue-property-decorator'
import NotFound from './404.vue'
//组件名前缀,避免冲突
const MODULES_PREFIX = 'Cell_MODULES_'
//引入modules文件夹下所有组件
const modulesFiles = require.context('./modules', true, /\.vue$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  //拼接并编码前缀,解决vue读取组件名时报错
  // @ts-ignore
  modules[MODULES_PREFIX + moduleName] = value.default
  return modules
}, {})

@Component({
  name: 'UniCell',
  components: {
    NotFound,
  },
})
export default class extends Vue {
  @Prop({ default: null }) use?: Record<string, string>
  // @ts-ignore
  getModules = (name) => modules[MODULES_PREFIX + name]

  @Prop({ default: '' }) input?: string

  @ModelSync('data', 'update:data', {
    default() {
      return this.elForm?.model || {}
    },
  })
  @ProvideReactive('data')
  dataValue: Record<string, any>

  @Prop({ default: () => ({}) })
  options: Record<string, any>

  @Prop({ default: null }) _schema?: Record<string, any>

  /** 适配ElementForm组件 */
  @Inject({ default: null }) elForm
  @Inject({ default: null }) elFormItem

  get elFormUse() {
    return this['$parent']?.['conf']?.__config__?.use
  }

  dispatch(componentName, eventName, params) {
    var parent = this.$parent || this.$root
    var name = parent.$options['componentName']

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent

      if (parent) {
        name = parent.$options['componentName']
      }
    }
    if (parent) {
      parent.$emit.apply(parent, [eventName].concat(params))
    }
  }

  pack(e) {
    if (typeof e == 'string') return { field: e }
    else return e
  }

  mounted() {
    // if (this.elForm?.model) this.$set(this, 'dataValue', this.elForm.model)
    // if (this['$parent']?.['conf']) {
    //   console.log(this.elForm, this.elFormItem)
    //   this.elFormItem.dispatch('ElFormItem', 'el.form.blur', [''])
    //   this.$emit('input', '11112333')
    // }
  }
}
</script>

<style scoped lang="scss">
.label {
  margin-right: 10px;
  margin-left: 20px;
}
</style>
