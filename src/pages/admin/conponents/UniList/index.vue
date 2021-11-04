<template>
  <el-container class="content">
    <el-header class="header">
      <div class="title flex-center">
        <div>{{ title }}</div>
        <slot name="title"></slot>
      </div>
      <div>
        <slot name="header:start"></slot>
        <slot name="search:start"></slot>
        <UniCell
          v-model="params"
          :options="{ size: 'small', style: { maxWidth: '150px' } }"
          :_schema="schema"
          v-bind="$attrs"
        />
        <div class="btns">
          <slot name="search"></slot>
          <template v-if="$attrs && Object.keys($attrs).length">
            <el-dropdown
              v-if="Object.keys(searchDropdown).length"
              split-button
              :show-timeout="0"
              type="primary"
              size="small"
              @click="runSearch"
              @command="(e) => searchDropdown[e]"
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
          <slot name="search:end"></slot>
          <slot name="header"></slot>
          <template v-for="({ show, fn, ...bind }, i) in pack(header)">
            <el-button
              v-if="show ? show(selection) : true"
              :key="i"
              @click=";(rawActiveForm = i), fn(selection)"
              v-bind="{ ...match('header', i), ...bind }"
            >
              {{ i }}
            </el-button>
          </template>
          <slot name="header:end"></slot>
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
          @selection-change="(e) => (selection = e)"
        >
          <el-table-column
            #default="scope"
            v-if="typeof expand == 'function' ? expand(scope) : expand"
            type="expand"
          >
            <slot name="expand" v-bind="scope" />
          </el-table-column>

          <template v-for="(item, i) in schema">
            <template v-if="i == '$index'">
              <el-table-column :label="item" align="center" type="index" width="70" :key="i">
                <template #default="scope">
                  <span>{{ scope.$index + (currentPageNow - 1) * pages.size + 1 }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-else-if="i == '$selection'">
              <el-table-column :label="item" align="center" type="selection" width="70" :key="i">
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
                    {{
                      ctx['formatter']
                        ? ctx['formatter']({ ...scope, value: scope.row[i] })
                        : scope.row[i]
                    }}
                  </slot>
                </template>
              </el-table-column>
            </template>
          </template>
          <el-table-column
            v-if="action && Object.keys(action).length"
            fixed="right"
            align="center"
            label="操作"
            :width="actionWidth"
          >
            <template #default="scope">
              <template v-for="({ show, fn, ...bind }, i) in pack(action)">
                <el-button
                  :key="i"
                  v-show="show ? show(scope) : true"
                  @click=";(rawActiveForm = i), fn(scope)"
                  v-bind="{ plain: true, ...match('action', i), ...bind }"
                >
                  {{ i }}
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :currentPage="pages.current"
          @update:currentPage="(e) => setPages({ current: e })"
          background
          layout="sizes,total,->,prev,pager,next,jumper"
          :total="pages.total"
          :page-size="pages.size"
          :page-sizes="[5, 10, 20, 50, 100]"
          @size-change="(e) => setPages({ size: e, current: 1 })"
        ></el-pagination>
        <!-- detail -->
        <transition name="el-fade-in">
          <div v-if="rawViewShow" class="detail">
            <div class="header">
              <strong>{{ rawFormOption.title || rawActiveForm }}</strong>
              <el-button
                type="primary"
                size="small"
                @click="rawFormOption.reject(), (rawViewShow = false)"
              >
                返回
              </el-button>
            </div>
            <div class="body">
              <div v-if="rawFormOption.text">{{ rawFormOption.text }}</div>
              <component
                v-if="rawFormOption.component"
                :is="rawFormOption.component"
                :close="() => (rawDialogShow = false)"
                :resolve="rawFormOption.resolve"
                :reject="rawFormOption.reject"
                v-bind="rawFormOption.props"
              ></component>
              <template v-else-if="rawFormOption.form">
                <Parser
                  :form-conf="parserFormConf"
                  :key="JSON.stringify(parserFormConf.fields)"
                  @submit="
                    (e) => {
                      rawFormOption.resolve(e)
                      rawViewShow = false
                    }
                  "
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
          destroy-on-close
        >
          <div v-if="rawFormOption.text">{{ rawFormOption.text }}</div>
          <Parser
            v-if="rawFormOption.form"
            :form-conf="parserFormConf"
            :key="JSON.stringify(parserFormConf.fields)"
            @submit="
              (e) => {
                rawFormOption.resolve(e)
                rawDialogShow = false
              }
            "
          />
          <component
            v-if="rawFormOption.component"
            :is="rawFormOption.component"
            :close="() => (rawDialogShow = false)"
            :resolve="rawFormOption.resolve"
            :reject="rawFormOption.reject"
            v-bind="rawFormOption.props"
          ></component>
          <template
            v-if="rawFormOption.text && !rawFormOption.component && !rawFormOption.form"
            #footer
          >
            <el-button @click="rawFormOption.reject(), (rawDialogShow = false)"> 取消 </el-button>
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
import { pickBy, reduce, cloneDeep } from 'lodash'

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

  /** 向自动表单中添加初始化data和扩展组件 */
  get parserFormConf() {
    const { form, data, use } = cloneDeep(this.rawFormOption)
    form.fields.forEach((item, i) => {
      const val = data ? data[item.__vModel__] : null
      const conp = use ? use[item.__vModel__] : null
      if (val) item.__config__.defaultValue = val
      if (conp) {
        item.__config__.tag = 'UniCell'
        if (typeof conp == 'string') item.__config__.use = { [conp]: true }
        else if (Array.isArray(conp)) item.__config__.use = { [conp[0]]: conp[1] || true }
      }
    })

    return form
  }

  /**
   * 以下函数是向外暴露的,不会被重写,可重写的方法在base中
   */

  /** 匹配action和header名字 返回对应的style */
  match(type: 'action' | 'header', name) {
    return reduce(
      Object.values(pickBy(this[type + 'Style'], (value, key) => new RegExp(key).test(name))),
      (obj: object, e: object) => ({ ...obj, ...e })
    )
  }

  pack(e: Function | Record<string, any>) {
    return Object.fromEntries(
      Object.entries(e).map(([k, v]) => [k, typeof v == 'function' ? { fn: v } : v])
    )
  }

  /** 打开覆盖层 */
  view(data) {
    return new Promise((resolve, reject) => {
      this.rawFormOption = { ...data, resolve, reject }
      this.rawViewShow = true
    })
  }

  /** 打开模态框 */
  dialog(data) {
    return new Promise((resolve, reject) => {
      this.rawFormOption = { ...data, resolve, reject }
      this.rawDialogShow = true
    })
  }
}
</script>

<style scoped lang="scss">
.content {
  position: relative;
  width: 100%;
  height: 100%;

  * {
    box-sizing: border-box;
  }
}

.header {
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

      &:last-of-type {
        margin-right: 0;
      }
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

  .btns {
    > * + * {
      margin-left: 10px;
    }
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
    overflow: auto;
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
