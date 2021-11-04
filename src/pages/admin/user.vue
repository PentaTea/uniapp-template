<template>
  <AdminWallpaper>
    <unicloud-db
      #default="{ data, loading }"
      collection="uni-id-users,uni-id-roles"
      field="avatar,username,username_raw,mobile,status,email,role{role_id,role_name,comment},dcloud_appid,register_date,last_login_date,delete_at"
      style="height: 100%"
      :page-size="size"
      page-data="replace"
      getcount
      orderby="delete_at desc"
      :where="log(where)"
      ref="db"
      @load="
        (data, ended, { count: total, current, size }) =>
          $refs.list.setPages({ total, current, size })
      "
    >
      <UniList
        :init="init"
        :data="data"
        :schema="schema"
        :loading="loading"
        input:用户名
        角色
        @fetch="
          (e) => {
            size = e.pages.size
            current = e.pages.current
            getWhere(e.params)
          }
        "
        ref="list"
        expand
      >
        <template #search>
          <el-checkbox v-model="displayDelete" border size="small">显示已删除</el-checkbox>
        </template>
        <template #expand="{ row }">
          <div class="padding padding-lr-xl">
            <pre v-html="obj2html(row)"></pre>
          </div>
        </template>
        <template #avatar="{ value }"><img :src="value" /></template>
        <template #username="{ row }">
          {{ row.username_raw || row.username }}
          <el-tag v-if="row.delete_at" type="danger" size="mini" style="margin-left: 15px">
            删除于 {{ app.time(row.delete_at).fromNow() }}
          </el-tag>
        </template>
        <template #role="{ value }">
          <div class="role">
            <el-popover
              v-for="item in value"
              :class="[item.role_id]"
              :key="item._id"
              width="200"
              trigger="hover"
              placement="top-start"
              :content="item.comment"
              :disabled="!item.comment"
            >
              <el-tag slot="reference" type="info">
                {{ item.role_name }}
              </el-tag>
            </el-popover>
          </div>
        </template>
        <template #register_date="{ value }">{{ value && app.time(value).fromNow() }}</template>
        <template #last_login_date="{ value }">{{ value && app.time(value).fromNow() }}</template>
      </UniList>
    </unicloud-db>
  </AdminWallpaper>
</template>

<script lang="ts">
import { Vue, Component, Watch } from '@app/mixins'
import AdminWallpaper from './conponents/AdminWallpaper.vue'
import UniList from './conponents/UniList/index.vue'
import stringifyObject from 'stringify-object'
import hanabi from '@app/common/hanabi'

import userFromAdd from './userAdd.json'
import userFromEdit from './userEdit.json'
@Component({
  components: {
    AdminWallpaper,
    UniList,
  },
})
export default class extends Vue {
  size = 10
  current = 1
  @Watch('current') fetch() {
    this.$refs.db &&
      this.$refs['db']['loadData']({
        current: this.current,
      })
  }
  where = 'delete_at==null'
  displayDelete = false
  getWhere(e) {
    const arr = this.displayDelete ? [] : ['delete_at==null']
    Object.entries(e || {}).forEach(([k, v]: [any, any]) => {
      if (this.is.empty(v)) return
      // arr.push(
      //   Array.isArray(v)
      //     ? `${k}.role_id==${v.map((e) => `'${e}'`).join(',')}`
      //     : `/${v}/i.test(${k})`
      // )
      // arr.push(`${k} in [${v.map((e) => `'${e}'`).join(',')}]`)
      switch (k) {
        case 'role':
          return v.forEach((e) => arr.push(`role.role_id=='${e}'`))
        default:
          return arr.push(`/${v}/i.test(${k})`)
      }
    })
    this.where = arr.join('&&')
  }

  init(page) {
    return {
      actionStyle: {
        删除: { type: 'warning' },
        永久删除: { type: 'danger' },
      },
      action: {
        编辑: {
          show: ({ row }) => !row.delete_at,
          fn: ({ row: { ...row } }) => {
            if (row.username_raw) row.username = row.username_raw
            if (row.role)
              row.role = row.role.map((e) => {
                console.log(e, e.role_id)

                return e.role_id
              })
            console.log(row)
            page
              .dialog({
                form: userFromEdit,
                data: row,
                use: {
                  role: '角色',
                },
              })
              .then((res) => ({ id: row._id, ...res }))
              .then((res) => app.cloud.user.updateUser(res))
              .then(() => page.reload())
          },
        },
        删除: {
          show: ({ row }) => !row.delete_at,
          fn: ({ row }) => {
            page
              .dialog({ text: '确认删除?' })
              .then(() => app.db.collection('uni-id-users').doc(row._id).remove('admin'))
              .then(() => page.reload())
          },
        },
        永久删除: {
          show: ({ row }) => !!row.delete_at,
          fn: ({ row }) => {
            page
              .dialog({ text: '操作不可逆,确认永久删除?' })
              .then(() => app.db.collection('uni-id-users').doc(row._id).remove('force'))
              .then(() => page.reload())
          },
        },
      },
      headerStyle: {
        删除: { type: 'warning' },
        永久删除: { type: 'danger' },
      },
      header: {
        删除选中内容: {
          show: (selection) =>
            selection && selection.length && !selection.every((e) => e.delete_at),
          fn(selection) {
            const $ = uniCloud.database().command
            page.dialog({ text: '确认删除?' }).then(() =>
              app.db
                .collection('uni-id-users')
                .where({ _id: $.or(selection.filter((e) => !e.delete_at).map((e) => $.eq(e._id))) })
                .remove()
                .then(() => page.reload())
            )
          },
        },
        永久删除选中内容: {
          show: (selection) => selection && selection.length && selection.every((e) => e.delete_at),
          fn(selection: any[]) {
            const $ = uniCloud.database().command
            page.dialog({ text: '操作不可逆,确认永久删除?' }).then(() =>
              app.db
                .collection('uni-id-users')
                .where({ _id: $.or(selection.map((e) => $.eq(e._id))) })
                .remove('force')
                .then(() => page.reload())
            )
          },
        },
        添加用户: () =>
          page
            .dialog({
              form: userFromAdd,
              use: {
                username: 'input',
                role: '角色',
              },
            })
            .then((res) => app.cloud.user.registerUser(res))
            .then(() => page.reload()),
      },
    }
  }
  schema = {
    $selection: '多选',
    avatar: { label: '', width: 100 },
    username: { label: '用户名', align: 'left', minWidth: 300 },
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
.role {
  display: flex;
  flex-wrap: wrap;

  > * {
    margin: 5px;
  }

  .admin span {
    color: #f16262;
    background-color: #f9ebeb;
    border-color: #f3d8d8;
  }
}
</style>
