<template>
  <div>
    <template v-for="(e, i) in use || $attrs">
      <span class="label" :key="'label_' + i">{{ i.split(':').pop() }}</span>
      <component
        :is="getModules(i.split(':')[0]) || 'NotFound'"
        :key="i"
        :name="i.split(':').pop()"
        :type="i.split(':')[0]"
        :options="{ ...options, ...e }"
        :_schema="_schema"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, ProvideReactive, ModelSync } from 'vue-property-decorator'
import NotFound from './404.vue'
//组件名前缀,避免冲突
const MODULES_PREFIX = 'Cell_MODULES_'
//引入modules文件夹下所有组件
const modulesFiles = require.context('./modules', true, /\.vue$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  //拼接并编码前缀,解决vue读取组件名时报错

  modules[MODULES_PREFIX + (Buffer as any).from(moduleName).toString('base64')] = value.default
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
  getModules = (name) => modules[MODULES_PREFIX + (Buffer as any).from(name).toString('base64')]

  @ModelSync('data')
  @ProvideReactive('data')
  dataValue!: Record<string, any>

  @Prop({ default: () => ({}) })
  options: Record<string, any>

  @Prop({ default: null }) _schema?: Record<string, any>
}
</script>

<style scoped lang="scss">
.label {
  margin-right: 10px;
  margin-left: 20px;
}
</style>
