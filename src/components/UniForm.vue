<template>
  <div>
    <template v-for="(item, field) in properties">
      <label
        v-if="isDisplay(item, field)"
        :key="field"
        class="cu-form-group"
        :class="{ 'align-start': getComponent(item) == 'textarea' }"
        @click="click(item, field)"
      >
        <div class="title" :style="{ minWidth: 'calc( ' + labelCount * 1.4 + 'em )' }">
          {{ item.title || item.label }}
          <span v-if="required.includes(field)" class="sup">*</span>
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
        <div v-if="getComponent(item) == 'textarea'" class="textarea">
          <textarea
            :placeholder="
              getProp(item).placeholder || item.description || '请输入' + item.title || item.label
            "
            :maxlength="-1"
            :focus="isFocus(field)"
            auto-height
            :value="h(field)"
            @input="(e) => set(field, e.detail.value)"
          />
        </div>
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
        <text
          v-if="is.array(errorStatus[field])"
          class="width100 padding-bottom-xs text-red text-sm text-right"
        >
          {{ errorStatus[field].join('\n') }}
        </text>
        <text v-if="item.tip" class="width100 padding-bottom-xs text-gray text-sm text-right">
          {{ item.tip }}
        </text>
      </label>
    </template>
    <tui-actionsheet
      :show="showActionSheet"
      :item-list="itemList"
      @click="(e) => (set(focusItemSync, e.index), (showActionSheet = false))"
      @cancel="() => (showActionSheet = false)"
    >
    </tui-actionsheet>
    <slot name="submit">
      <div class="bg-white padding">
        <div class="flex-center padding light bg-cyan" @click="submit">
          {{ submitText }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from '@app/mixins'
import tuiActionsheet from '@app/components/tui-actionsheet.vue'
import anymatch from 'anymatch'

@Component({
  components: { tuiActionsheet },
})
export default class extends Vue {
  @Prop({ default: () => ({}) }) data: object
  @Prop() schema: object
  @Prop({ default: () => '' }) match: Array<string> | string
  @Prop({ default: 4 }) labelCount: number
  @Prop({ default: '保存' }) submitText: string

  get properties() {
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
    if (this.default(field) == data) this.$delete(this.updateData, field)
    else this.$set(this.updateData, field, data)
    this.validator(field)
  }

  h(field) {
    return this.updateData[field] ?? this.data[field] ?? this.properties[field].defaultValue
  }

  default(field) {
    return this.data[field] ?? this.properties[field].defaultValue
  }

  focusItem = ''
  focusItemSync = ''
  showActionSheet = false
  itemList = []
  click(item, field) {
    this.focusItem = ''
    setTimeout(() => (this.focusItem = field), 0)
    this.focusItemSync = field
    switch (this.getComponent(item)) {
      case 'actionsheet':
        this.showActionSheet = true
        this.itemList = item.enum
        break

      default:
        break
    }
  }

  isFocus(field) {
    return this.focusItem == field
  }

  formatter = {
    email: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
    url: /^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/,
  }

  get required() {
    return this.schema['schema']?.['required'] || this.schema['required'] || []
  }

  errorMessage = {} as { [field: string]: Array<string> | 'clear' }

  errorStatus = {} as { [field: string]: 'waiting' | 'clear' | Array<string> }

  @Watch('focusItemSync') blur(newVal, oldVal) {
    if (!oldVal) return
    if (!newVal) return
    this.$set(this.errorStatus, oldVal, this.errorMessage[oldVal])
    if (!this.errorStatus[newVal]) this.$set(this.errorStatus, newVal, 'waiting')
  }

  validator(field) {
    const item = this.properties[field]
    const error = []

    if (this.updateData[field]) {
      //format
      if (item.format && !this.formatter[item.format].test(this.updateData[field]))
        error.push('请输入正确的' + (item.title || item.label))
      //pattern
      if (item.pattern && !RegExp(item.pattern).test(this.updateData[field]))
        error.push('请输入正确的' + (item.title || item.label))
    } else {
      //required
      if (this.required.includes(field) && !this.updateData[field])
        error.push((item.title || item.label) + '不能为空')
    }

    if (error.length) this.$set(this.errorMessage, field, [...error])
    else this.$set(this.errorMessage, field, 'clear')
    if (this.is.array(this.errorStatus[field])) this.errorStatus[field] = this.errorMessage[field]
    return error.length
  }

  @Emit()
  submit() {
    return new Promise((resolve, reject) => {
      let count = 0
      Object.keys(this.properties).forEach((key) => (count += this.validator(key)))
      if (!count) resolve(this.updateData)
      else {
        this.errorStatus = { ...this.errorMessage }

        const errorkey = Object.keys(this.errorStatus).find((key) =>
          this.is.array(this.errorStatus[key])
        )
        console.log(this.errorStatus[errorkey][0])
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.cu-form-group {
  flex-wrap: wrap;
  padding: 10rpx 30rpx;
}

.cu-form-group + .cu-form-group {
  border-top: none;
}

.cu-form-group .title {
  display: flex;
  height: 80rpx;
  align-items: center;
}

.cu-form-group.align-start .title {
  height: 1.6em;
  margin-top: 32rpx;
  line-height: 1.6em;
}

.cu-form-group .textarea {
  padding: 17rpx;
  margin: 15rpx 0;
  flex: 1;

  textarea {
    margin: 0;
  }
}

.cu-form-group input {
  height: 70rpx;
  padding: 0 17rpx;
}

.cu-form-group {
  .textarea,
  input {
    position: relative;

    &::after {
      position: absolute;
      top: 0rpx;
      left: 0;
      width: 160%;
      height: 160%;
      pointer-events: none;
      border: 1rpx solid var(--alpha-dark-90);
      border-radius: inherit;
      content: ' ';
      transform: scale(0.625);
      box-sizing: border-box;
      transform-origin: 0 0;
    }
  }
}

.sup {
  margin-left: 12rpx;
  font-size: 32rpx;
  color: var(--light60);
  vertical-align: text-top;
}
</style>
