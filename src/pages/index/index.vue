<template>
  <div class="flex flex-direction">
    Hello, world
    {{ name }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {},
  setup(props, context) {},
})
export default class extends Vue {
  name = '123'

  mounted() {
    setTimeout(() => {
      this.aaa()
      console.log(process.env)

      uni.post.getUser({ cz: 11111 }).then((res) => {
        res.data
      })
    }, 2000)
  }

  aaa() {
    this.name = '456'
  }
}
</script>

<style lang="scss" scoped></style>
