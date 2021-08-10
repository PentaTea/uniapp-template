<template>
  <BasePage title="表单生成">
    <div class="padding-top">
      <UniForm :schema="schema" match="!create_date" :data="{ bool_test: true }"></UniForm>
    </div>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import collection from './common/opendb-contacts.json'

@Component({
  components: {},
})
export default class extends Vue {
  schema = collection.schema
  mounted() {
    console.log(collection.schema)
  }
}
</script>

<style lang="scss" scoped></style>
