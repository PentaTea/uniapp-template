<template>
  <ElInput clearable :placeholder="'请输入' + name" v-model="value" v-bind="options"></ElInput>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Base from './base'

@Component({})
export default class extends Base {
  mounted() {}
}
</script>
<style scoped lang="scss"></style>
