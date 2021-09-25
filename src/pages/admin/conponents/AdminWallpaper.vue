<template>
  <div class="main-wrapper">
    <div class="main-content">
      <section class="section">
        <slot />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import '../assets/css/style.css'
import '../assets/css/custom.css'
import '../assets/css/components.css'
import { Vue, Component } from '@app/mixins'

@Component({
  components: {},
})
export default class extends Vue {}
</script>

<style lang="scss">
.row {
  --bs-gutter-x: 20px;
}

.main-wrapper {
  position: relative;
  padding-top: 0.1px;

  &::before {
    position: absolute;
    bottom: auto;
    height: 70px;
    background-color: #42b883;
    content: '';
    inset: 0;
  }
}

.main-content {
  padding: 0;
}
</style>
