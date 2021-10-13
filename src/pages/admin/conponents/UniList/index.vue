<template>
  <el-container class="content">
    <el-header class="header">
      <div class="title flex-center"></div>
      <div>
        <slot name="search"></slot>
        <UniCell
          v-model="rawParams"
          :options="{ size: 'small' }"
          :_schema="schema"
          v-bind="$attrs"
        />
        <div>
          <template v-if="$attrs && Object.keys($attrs).length">
            <el-dropdown
              v-if="Object.keys(searchDropdown).length"
              split-button
              :show-timeout="0"
              type="primary"
              size="small"
              @click="runSearch"
              @command="searchDropdown[$event]"
            >
              <template v-if="searchComment">
                <span style="margin: 0 5px">{{ searchComment }}</span>
              </template>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(k, v) in searchDropdown" :key="v" :command="v">
                  {{ v }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-else
              split-button
              :show-timeout="0"
              type="primary"
              size="small"
              @click="runSearch"
            >
              {{ searchComment }}
            </el-button>
          </template>
          <slot name="header"></slot>
          <template v-for="(item, i) in pack(header)">
            <el-button
              v-if="item"
              :key="i"
              @click=";(rawActiveForm = i), item()"
              v-bind="match('header', i)"
            >
              {{ i }}
            </el-button>
          </template>
        </div>
      </div>
    </el-header>
    <el-container>
      <slot></slot>
      <el-main style="padding: 0">
        <el-table
          v-loading="loadingValue"
          element-loading-custom-class="loading-mask"
          :data="rawData"
          height="calc(100% - 40px)"
          style="width: 100%; margin-bottom: 4px"
          class="main-list"
        >
          <el-table-column v-if="expand" type="expand">
            <template #default="scope">
              <slot name="expand" v-bind="scope" />
            </template>
          </el-table-column>
          <template v-for="(item, i) in schema">
            <template v-if="i == '$index'">
              <el-table-column :label="item" align="center" type="index" width="70" :key="i">
                <template #default="scope">
                  <span>{{ scope.$index + (currentPageNow - 1) * pages.size + 1 }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column
                v-for="ctx in [typeof item == 'string' ? { label: item } : item]"
                show-overflow-tooltip
                :prop="i"
                :label="ctx.label"
                v-bind="{ ...columnStyle, ...ctx }"
                :key="ctx.label"
              >
                <template #default="scope">
                  <slot :name="i" v-bind="{ ...scope, value: scope.row[i] }">
                    {{ ctx['formatter'] ? ctx['formatter'](scope) : scope.row[i] }}
                  </slot>
                </template>
              </el-table-column>
            </template>
          </template>
          <el-table-column v-if="action" fixed="right" align="center" label="操作">
            <template #default="scope">
              <template v-for="(item, i) in pack(action)">
                <el-button
                  :key="i"
                  v-show="item.show ? item.show(scope) : true"
                  @click="item.fn(scope)"
                  plain
                  v-bind="match('action', i)"
                >
                  {{ i }}
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :currentPage="rawPages.current"
          @update:currentPage="setPages({ current: $event })"
          background
          layout="sizes,total,->,prev,pager,next,jumper"
          :total="pages.total"
          :page-size="pages.size"
          :page-sizes="[5, 10, 20, 50, 100]"
          @size-change="setPages({ size: $event })"
        ></el-pagination>
        <!-- detail -->
        <transition name="el-fade-in">
          <div v-if="rawViewShow" class="detail">
            <div class="header">
              <strong>{{ rawFormOption.title || rawActiveForm }}</strong>
              <el-button type="primary" size="small" @click="rawViewShow = false">返回</el-button>
            </div>
            <div class="body">
              <div v-if="rawFormOption.text">{{ rawFormOption.text }}</div>
              <component
                v-if="rawFormOption.component"
                :is="rawFormOption.component"
                :close="() => (rawViewShow = false)"
                v-bind="rawFormOption"
              ></component>
              <template v-else-if="rawFormOption.form">
                <Parser
                  :form-conf="rawFormOption.form"
                  @submit="rawFormOption.resolve($event), (rawViewShow = false)"
                />
              </template>
            </div>
          </div>
        </transition>
        <!-- dialog -->
        <el-dialog
          v-if="rawFormOption"
          :visible.sync="rawDialogShow"
          :title="rawFormOption.title || rawActiveForm"
          append-to-body
        >
          <div v-if="rawFormOption.text">{{ rawFormOption.text }}</div>
          <Parser
            v-if="rawFormOption.form"
            :form-conf="rawFormOption.form"
            @submit="rawFormOption.resolve($event), (rawDialogShow = false)"
          />
          <component
            v-if="rawFormOption.component"
            :is="rawFormOption.component"
            :close="() => (rawDialogShow = false)"
            v-bind="rawFormOption"
          ></component>
          <template
            v-if="rawFormOption.text && !rawFormOption.component && !rawFormOption.form"
            #footer
          >
            <el-button @click="rawDialogShow = false">取消</el-button>
            <el-button type="primary" @click="rawFormOption.resolve(), (rawDialogShow = false)">
              确定
            </el-button>
          </template>
        </el-dialog>

        <slot name="footer"></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Options from './custom'
import Parser from './lib/form-gen-parser.min'
import UniCell from '../UniCell'
import match from 'anymatch'
import { pickBy, reduce } from 'lodash'

Vue.component('UniCell', UniCell)

@Component({
  name: 'UniList',
  components: {
    Parser,
  },
})
export default class extends Options {
  mounted() {
    const oldReload = this.reload
    this.reload = () => {
      oldReload()
      this.setPages({ current: 1 })
      this.rawFetch()
    }
  }

  /**
   * 以下函数是向外暴露的,不会被重写,可重写的方法在base中
   */

  /** 匹配action和header名字 返回对应的style */
  match(type: 'action' | 'header', name) {
    return reduce(
      Object.values(pickBy(this[type + 'Style'], (value, key) => match(key, name))),
      (obj: object, e: object) => ({ ...obj, ...e })
    )
  }

  pack(e: Function | Record<string, any>) {
    if (typeof e == 'function') {
      e = {
        fn: e,
      }
    }
    return e
  }

  /** 打开覆盖层 */
  view(data) {
    return new Promise((resolve) => {
      this.rawFormOption = { ...data, resolve }
      this.rawViewShow = true
    })
  }

  /** 打开模态框 */
  dialog(data) {
    return new Promise((resolve) => {
      this.rawFormOption = { ...data, resolve }
      this.rawDialogShow = true
    })
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
}

::v-deep .header {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;

    > div {
      display: flex;
      margin-right: 20px;
      font-size: 14px;
      white-space: nowrap;
      align-items: center;
    }
  }

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .el-button {
    font-weight: 400;
    border-radius: 0 !important;

    [class*='ri-'] + span {
      margin-left: 5px;
    }

    [class*='ri-'],
    [class*='el-'] {
      font-size: 1em;
    }
  }

  .el-dropdown + .el-button {
    margin-left: 10px;
  }
}

.detail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 900;
  display: flex;
  background-color: rgba(255, 255, 255, 0.95);
  flex-direction: column;

  .header {
    display: flex;
    height: 60px;
    padding: 20px;
    background: #fff;
    justify-content: space-between;
    align-items: center;
  }

  .body {
    width: 100%;
    padding: 40px 100px 40px 50px;
    overflow: scroll;
    flex: 1;

    > div {
      padding-bottom: 50px;
    }
  }
}

::v-deep .el-pagination__rightwrapper {
  * {
    border: unset !important;
    border-radius: 0 !important;
  }

  .btn-prev,
  .btn-next {
    height: 28px;
  }
}
</style>
