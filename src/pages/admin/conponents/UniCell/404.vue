<template>
  <span>缺少相关实现: [{{ type }}.vue]</span>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Base from './modules/base'

@Component({})
export default class extends Base {
  mounted() {}
}
</script>
<style scoped lang="scss">
span {
  padding: 10px 20px;
  background: #eee;
}
</style>
