<template>
  <BasePage customNav>
    <Muya></Muya>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import Muya from './components/muya/muya.vue'

@Component({
  components: { Muya },
})
export default class extends Vue {}
</script>

<style lang="scss" scoped></style>
