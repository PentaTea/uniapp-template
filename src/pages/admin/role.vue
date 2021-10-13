<template>
  <AdminWallpaper>
    <unicloud-db
      #default="{ data, loading, pagination }"
      collection="uni-id-users"
      style="height: 100%"
      :page-size="pageSize"
      page-data="replace"
      getcount
      :where="log(where)"
      ref="db"
    >
      <UniList
        :init="init"
        :data="data"
        :schema="schema"
        :loading="loading"
        input:用户名
        :pages="{ current: pagination.current, total: pagination.count, size: pagination.size }"
        @update:pages="
          () => {
            pageSize != $event.size
              ? (pageSize = $event.size)
              : $refs.db &&
                $refs.db.loadData({
                  current: $event.current,
                })
          }
        "
        @fetch="getWhere($event.params)"
        ref="list"
      >
        <template #avatar="{ value }"><img :src="value" /></template>
      </UniList>
    </unicloud-db>
  </AdminWallpaper>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import AdminWallpaper from './conponents/AdminWallpaper.vue'
import UniList from './conponents/UniList/index.vue'
@Component({
  components: {
    AdminWallpaper,
    UniList,
  },
})
export default class extends Vue {
  pageSize = 10
  where = ''
  getWhere(e) {
    const arr = []
    Object.entries(e || {}).forEach(([k, v]) => {
      v && arr.push(`/${v}/i.test(${k})`)
    })
    this.where = arr.join('&&')
  }

  init(page) {
    return {
      action: {
        删除: {
          show: ({ $index }) => $index != 2,
          fn: () => {
            page.dialog({ text: '确认删除?' }).then(() => {
              console.log('执行删除')
            })
          },
        },
      },
      header: {
        测试文本: () =>
          page.dialog({ text: '确认删除?' }).then(() => {
            console.log('执行删除')
          }),
        测试表单: () =>
          page
            .dialog({
              form: {
                fields: [
                  {
                    __config__: {
                      label: '级联选择',
                      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
                      method: 'get',
                      dataKey: 'list',
                      showLabel: true,
                      labelWidth: null,
                      tag: 'el-cascader',
                      tagIcon: 'cascader',
                      layout: 'colFormItem',
                      defaultValue: [],
                      dataType: 'dynamic',
                      span: 24,
                      required: true,
                      regList: [],
                      changeTag: true,
                      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
                      formId: 101,
                      renderKey: 1633771737751,
                    },
                    options: [
                      {
                        id: 1,
                        value: 1,
                        label: '选项1',
                        children: [
                          {
                            id: 2,
                            value: 2,
                            label: '选项1-1',
                          },
                        ],
                      },
                    ],
                    placeholder: '请选择级联选择级联选择',
                    style: {
                      width: '100%',
                    },
                    props: {
                      props: {
                        multiple: false,
                        label: 'label',
                        value: 'value',
                        children: 'children',
                      },
                    },
                    'show-all-levels': true,
                    disabled: false,
                    clearable: true,
                    filterable: false,
                    separator: '/',
                    __vModel__: 'field101',
                  },
                  {
                    __config__: {
                      label: '多行文本',
                      labelWidth: null,
                      showLabel: true,
                      tag: 'el-input',
                      tagIcon: 'textarea',
                      required: true,
                      layout: 'colFormItem',
                      span: 24,
                      regList: [],
                      changeTag: true,
                      document: 'https://element.eleme.cn/#/zh-CN/component/input',
                      formId: 102,
                      renderKey: 1633771739130,
                    },
                    type: 'textarea',
                    placeholder: '请输入多行文本',
                    autosize: {
                      minRows: 4,
                      maxRows: 4,
                    },
                    style: {
                      width: '100%',
                    },
                    maxlength: null,
                    'show-word-limit': false,
                    readonly: false,
                    disabled: false,
                    __vModel__: 'field102',
                  },
                  {
                    __config__: {
                      label: '多行文本',
                      labelWidth: null,
                      showLabel: true,
                      tag: 'el-input',
                      tagIcon: 'textarea',
                      required: true,
                      layout: 'colFormItem',
                      span: 24,
                      regList: [],
                      changeTag: true,
                      document: 'https://element.eleme.cn/#/zh-CN/component/input',
                      formId: 103,
                      renderKey: 1633771739283,
                    },
                    type: 'textarea',
                    placeholder: '请输入多行文本',
                    autosize: {
                      minRows: 4,
                      maxRows: 4,
                    },
                    style: {
                      width: '100%',
                    },
                    maxlength: null,
                    'show-word-limit': false,
                    readonly: false,
                    disabled: false,
                    __vModel__: 'field103',
                  },
                  {
                    __config__: {
                      label: '计数器',
                      showLabel: true,
                      changeTag: true,
                      labelWidth: null,
                      tag: 'el-input-number',
                      tagIcon: 'number',
                      span: 24,
                      layout: 'colFormItem',
                      required: true,
                      regList: [],
                      document: 'https://element.eleme.cn/#/zh-CN/component/input-number',
                      formId: 104,
                      renderKey: 1633771740534,
                    },
                    placeholder: '计数器',
                    step: 1,
                    'step-strictly': false,
                    'controls-position': '',
                    disabled: false,
                    __vModel__: 'field104',
                  },
                ],
                formRef: 'elForm',
                formModel: 'formData',
                size: 'medium',
                labelPosition: 'right',
                labelWidth: 100,
                formRules: 'rules',
                gutter: 15,
                disabled: false,
                span: 24,
                formBtns: true,
                unFocusedComponentBorder: false,
              },
            })
            .then((res) => console.log(res)),
        添加角色: () => page.view({}),
      },
    }
  }
  schema = {
    $index: '序号',
    username: '用户名',
    avatar: '头像',
  }
}
</script>

<style lang="scss" scoped></style>
