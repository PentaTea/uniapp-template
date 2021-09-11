<template>
  <BasePage background="white" title="富文本渲染">
    <div class="padding">
      <mp-html :content="app.md2html(content)" />
    </div>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue'

@Component({
  components: { mpHtml },
})
export default class extends Vue {
  content = `
# 富文本测试
---
> 引用

- 列表

[x] 多选框
`
}
</script>

<style lang="scss" scoped></style>
