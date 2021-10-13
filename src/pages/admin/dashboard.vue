<template>
  <AdminWallpaper> </AdminWallpaper>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import AdminWallpaper from './conponents/AdminWallpaper.vue'
@Component({
  components: {
    AdminWallpaper,
  },
  setup(props, context) {},
})
export default class extends Vue {
  ROUTES = ROUTES.find((e) => e.path.split('/')[2] == 'admin')
}
</script>

<style lang="scss" scoped></style>
