<template>
  <div>
    <template v-for="(item, field) in getProperties()">
      <label
        v-if="isDisplay(item, field)"
        :key="field"
        class="cu-form-group"
        :class="{ 'align-start': getComponent(item) == 'textarea' }"
        @click="click(item, field)"
      >
        <div class="title" :style="{ minWidth: 'calc(' + labelCount + 'em + 15px)' }">
          {{ item.title || item.label }}
        </div>
        <input
          v-if="getComponent(item) == 'input'"
          name="input"
          :type="item.type || item.bsonType == 'int' ? 'number' : 'text'"
          :placeholder="
            getProp(item).placeholder || item.description || '请输入' + item.title || item.label
          "
          :focus="isFocus(field)"
          :value="h(field)"
          @input="(e) => set(field, e.detail.value)"
        />
        <textarea
          v-if="getComponent(item) == 'textarea'"
          :placeholder="
            getProp(item).placeholder || item.description || '请输入' + item.title || item.label
          "
          :maxlength="-1"
          :focus="isFocus(field)"
          auto-height
          :value="h(field)"
          @input="(e) => set(field, e.detail.value)"
        />
        <switch
          v-if="getComponent(item) == 'switch'"
          @change="(e) => set(field, e.detail.value)"
          :class="h(field) ? 'checked' : ''"
          :checked="h(field)"
        />
        <picker
          v-if="getComponent(item) == 'picker'"
          :index="item.enum.findIndex((e) => e.value == h(field))"
          :range="item.enum.map((e) => e.text)"
          @change="(e) => set(field, e.detail.value)"
        >
          <div class="picker">{{ item.enum.find((e) => e.value == h(field)).text }}</div>
        </picker>
        <div v-if="getComponent(item) == 'actionsheet'" class="button">
          <div>{{ item.enum.find((e) => e.value == h(field)).text }}</div>
        </div>
        <text v-if="item.tip" class="width100 padding-tb-xs text-gray text-sm text-right">
          {{ item.tip }}
        </text>
      </label>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from '@app/mixins'
import anymatch from 'anymatch'
import * as _ from 'lodash'

@Component({
  components: {},
})
export default class extends Vue {
  @Prop({ default: () => ({}) }) data: object
  @Prop() schema: object
  @Prop({ default: () => '' }) match: Array<string> | string
  @Prop({ default: 4 }) labelCount: number

  getProperties() {
    return this.schema['schema']?.['properties'] || this.schema['properties'] || this.schema
  }

  isDisplay(item, field) {
    const match = typeof this.match === 'string' ? this.match.split(',') : this.match
    match.push('*')
    return item.title && anymatch(match, field)
  }
  getComponent(item) {
    if (item.component?.name) return item.component.name
    else
      return {
        string: 'input',
        bool: 'switch',
        Array: '',
        int: item.enum ? 'actionsheet' : item.minimum || item.maximum ? 'slider' : 'input',
        unknown: 'input',
      }[item.bsonType || item.type || 'unknown']
  }

  getProp(item) {
    return (item.component && item.component.props && item.component.props) || {}
  }

  updateData = {}
  set(field, data) {
    console.log(field, data)

    if (this.default(field) == data) this.$delete(this.updateData, field)
    else this.$set(this.updateData, field, data)
  }

  h(field) {
    return this.updateData[field] ?? this.data[field] ?? this.getProperties()[field].defaultValue
  }

  default(field) {
    return this.data[field] ?? this.getProperties()[field].defaultValue
  }

  focusItem = ''
  click(item, field) {
    this.focusItem = ''
    setTimeout(() => (this.focusItem = field), 0)
    switch (this.getComponent(item)) {
      case 'actionsheet':
        uni.showActionSheet({
          itemList: item.enum.map((e) => e.text),
          success: (e) => this.set(field, e.tapIndex),
        })
        break

      default:
        break
    }
  }

  isFocus(field) {
    return this.focusItem == field
  }
}
</script>

<style lang="scss" scoped>
.cu-form-group {
  flex-wrap: wrap;
  padding: 10rpx 30rpx;
}

.cu-form-group.align-start .title {
  height: 1em;
  margin-top: 20rpx;
  line-height: 1em;
}

.cu-form-group textarea {
  margin: 20rpx 0;
}
</style>
