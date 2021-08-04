<template>
  <BasePage :tabBar="2">
    <template #navLeft>
      <div>关于我</div>
    </template>
    <template #navRight>
      <div>右插槽</div>
    </template>
    <div class="flex-center flex-direction padding">
      Hello, world
    </div>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'

@Component({
  components: {},
  setup(props, context) {},
})
export default class extends Vue {}
</script>

<style lang="scss" scoped></style>
