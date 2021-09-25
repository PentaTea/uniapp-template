# uniapp 脚手架

## 约定

- [Vue 风格指南](https://cn.vuejs.org/v2/style-guide/index.html)
- 请使用 yarn
- 请使用 vscode 开发
- 最好使用 yarn commit 进行提交操作，别忘了先 git add .
- 在 push 之前别忘使用变基拉取 git pull --rebase

### 封装

#### 组件：BasePage

- 每个页面文件根元素使用
- 提供了基础的 navbar 和滑动处理
- 已全局注册，可直接使用

常用参数：

```ts
title: string //页面标题
background: string //页面背景色
navBackgroundColor: string //navbar背景色
down: boolean //开启下拉刷新
up: boolean //开启上拉加载
```

#### 功能：vuex

- 使用宽松模式：可以直接更改 state 变量，一般不需要 mutation
- 已挂载到 app 变量中

定义 state 和 action:

```ts
// src/store/module/user.ts
// User类中
token = ''
@action async login() {
    // 执行登录操作...
    this.token = 12345
}
```

在任意位置使用：

```ts
console.log(app.User.token)
app.User.token = 12345
```

#### 功能：请求代理器

- 用于发出 post 请求
- 只需写请求名和地址就可以自动生成请求方法
- 已挂载到 app 变量中

定义请求：

```ts
export const post = {
  // 请求名:'地址',
  login: '/admin/login',
}
```

在任意位置使用：

```ts
app.post
  .login({
    username: 1,
    password: 2,
  })
  .then((res) => {
    console.log(res)
  })

//或者使用await语法糖
const res = app.post.login({
  username: 1,
  password: 2,
})
```

#### 全局变量：app

- 提供【基础工具】
- 提供[访问 vuex 的接口](#功能vuex)
- 提供[请求代理器](#功能请求代理器)
- 在任意位置可以访问，但由于小程序逻辑层渲染层通信机制，在 vue 模板中**响应值**使用需要 a 函数包裹，函数值不影响

下例访问了 app 挂载的 time 工具和 vuex 的 User 模块：

```vue
<template>
  <div>
    <!-- 绑定值需要包裹 -->
    <div>{{ a(app.User.token) }}</div>
    <!-- 函数直接使用 -->
    <div>{{ app.time('2001-4-11').format('YYYY-MM-DD') }}</div>
  </div>
</template>

<script lang="ts">
// script 中直接使用
console.log(app.User.token)
</script>
```

#### 写法：vue 类语法

```ts
import { Vue, Component, Prop } from '@app/mixins'
import 组件1 from '@app/components/组件1.vue'

@Component({
  components: {
    组件1, //引入组件
  },
})
export default class extends Vue {
  //data定义
  a = 1
  b = 2

  //prop定义
  //有默认值的字符串参数
  @Prop({ default: '' }) title: string
  //无默认值的数字参数
  @Prop() count: number

  //computed计算属性定义
  get sum() {
    return this.a + this.b
  }

  //普通函数
  aaa() {
    //访问vuex
    console.log(app.User.userInfo)
  }

  //生命周期函数
  mounted() {
    //访问data
    this.a = 2

    //访问计算属性
    console.log(this.sum)

    //访问参数
    console.log(this.count)

    //调用函数
    this.aaa()
  }
}
```

其他高级用法请查看[vue-property-decorator 文档](https://github.com/kaorun343/vue-property-decorator)

#### 功能：路由

- 路由自动生成兼容全端
- 约定大于配置
- 相关方法已挂载到 app 变量中

自动路由约定 `不遵守将无法成功显示页面`:

1. src/pages 文件夹存放所有页面
2. src/pages/** 文件夹为分包文件夹，**为分包名，名为 index 的文件夹为主包
3. 分包文件夹中的根级 vue 文件为页面文件，次级不被路由

总结：

页面路径：`src/pages/分包名称/页面名称.vue`

分包组件路径：`src/pages/分包名称/components/组件名称.vue`（不被打包进主包，节省空间）

跳转方法：

```ts
app.to('index') //同分包跳转
app.to('my/index') //跳转到my分包的index页面
app.to('/pages/my/index') //完整路径

app.back() //返回上一级
```

#### 其他工具

> 需要时再查看对应文档

- app.time `dayjs 时间处理`
- app.md2html `markdown-it md语法渲染`
- `待续...`

## 依赖

### 技术栈

- uniapp
- typescript
- vue2
- vuex
- sass

### 写法

- vue-property-decorator `vue2 类/装饰器语法 - 常用`
- vuex-class-component `vuex 类/装饰器语法 - 常用`
- @vue/composition-api `vue3 组合式语法`

### 库

- axios
- dayjs
- lodash

### 规范

- husky
- eslint
- prettier
- stylelint
