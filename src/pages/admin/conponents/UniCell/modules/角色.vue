<template>
  <Select :payload="roles" multiple></Select>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Base from './base'
import Select from './select.vue'

@Component({
  components: {
    Select,
  },
})
export default class extends Base {
  roles = []
  mounted() {
    app.db
      .collection('uni-id-roles')
      .get()
      .then((res) => {
        this.roles = res.result.data.map((item) => {
          return {
            label: item.role_name,
            value: item.role_id,
          }
        })
      })
  }
}
</script>
<style scoped lang="scss"></style>
