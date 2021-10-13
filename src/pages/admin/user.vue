<template>
  <AdminWallpaper>
    <unicloud-db
      #default="{ data, loading, pagination }"
      collection="uni-id-users,uni-id-roles"
      field="avatar,username,username_raw,mobile,status,email,role,dcloud_appid,register_date"
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
        expand
      >
        <template #expand="{ row }">
          <div class="padding padding-lr-xl">
            <pre v-html="obj2html(row)"></pre>
          </div>
        </template>
        <template #avatar="{ value }"><img :src="value" /></template>
        <template #username="{ row }">{{ row.username_raw || row.username }}</template>
        <template #role="{ value }">
          <div>
            <el-popover
              v-for="item in value"
              :class="[item.role_id]"
              :key="item._id"
              width="200"
              trigger="hover"
              placement="top-start"
              :content="item.comment"
            >
              <el-tag slot="reference" type="success">
                {{ item.role_name }}
              </el-tag>
            </el-popover>
          </div>
        </template>
        <template #register_date="{ value }">{{ app.time(value).fromNow() }}</template>
        <template #last_login_date="{ value }">{{ app.time(value).fromNow() }}</template>
      </UniList>
    </unicloud-db>
  </AdminWallpaper>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import AdminWallpaper from './conponents/AdminWallpaper.vue'
import UniList from './conponents/UniList/index.vue'
import stringifyObject from 'stringify-object'
import hanabi from '@app/common/hanabi'
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
        删除: ({ row }) => {
          page.dialog({ text: '确认删除?' }).then(() => {
            console.log('执行删除')
          })
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
    avatar: { label: '', width: 100 },
    username: { label: '用户名', align: 'left', width: 200 },
    role: '角色',
    gender: { label: '性别', formatter: ({ cellValue }) => Gender[cellValue] },
    register_date: '注册时间',
    last_login_date: '最近登录',
  }
  obj2html(data) {
    return hanabi(
      stringifyObject(data, {
        indent: '  ',
      })
    )
  }
}

enum Gender {
  未知 = 0,
  男,
  女,
}
</script>

<style lang="scss" scoped>
pre {
  margin: 0;
  user-select: text;
}
</style>
