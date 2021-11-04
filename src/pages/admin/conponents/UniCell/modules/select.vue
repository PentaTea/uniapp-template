<template>
  <ElSelect
    clearable
    filterable
    :placeholder="'请选择' + name"
    v-model="value"
    v-bind="{ ...options, ...$attrs }"
  >
    <ElOption
      v-for="(item, i) in options.data || payload"
      :key="i"
      :label="item.label"
      :value="item.value"
    ></ElOption>
  </ElSelect>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Base from './base'

@Component({})
export default class extends Base {
  @Prop() payload: Array<any>
  mounted() {}
}
</script>
<style scoped lang="scss"></style>
