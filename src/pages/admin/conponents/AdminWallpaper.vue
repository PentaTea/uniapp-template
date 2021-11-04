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

::v-deep pre {
  margin: 0;
  user-select: text;
}

// ::v-deep .el-table td,
// ::v-deep .el-table th.is-leaf {
//   border-bottom: 1px dashed #d7d7d7;
// }

.main-wrapper {
  position: relative;
  height: 100%;
  padding-top: 0.1px;
  background: #fff;

  // &::before {
  //   position: absolute;
  //   bottom: auto;
  //   height: 70px;
  //   background-color: #42b883;
  //   content: '';
  //   inset: 0;
  // }
}

.main-content {
  top: 0;
  height: 100%;
  padding: 0;
  margin: 0;
}

.section {
  height: calc(100vh - 70px);

  > uni-view {
    height: 100%;
  }

  > *:first-child {
    margin: 0;
  }
}
</style>
