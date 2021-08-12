<template>
  <BasePage title="表单生成">
    <div class="padding-top">
      <UniForm
        ref="form"
        :schema="schema"
        match="!create_date"
        :data="{ bool_test: true }"
        @submit="insideSubmit"
      ></UniForm>
      <div class="bg-white padding">
        <div class="flex-center padding light bg-cyan" @click="outsideSubmit">
          外部调用表单提交
        </div>
      </div>
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
  insideSubmit(data) {
    console.log('insideSubmit', data)
  }
  outsideSubmit() {
    this.$refs['form']['submit']().then((data) => {
      console.log('outsideSubmit', data)
    })
  }
}
</script>

<style lang="scss" scoped></style>
