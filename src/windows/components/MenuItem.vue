<template>
  <li :class="{ 'nav-item dropdown': !!hasChildren, active: active(data) }">
    <a v-if="hasChildren" class="nav-link has-dropdown" @click="show = !show">
      <i :class="data.style && data.style.icon"></i>
      <span>{{ data.name || (data.style && data.style.name) || data.path }}</span>
      <i class="ri-arrow-drop-down-line"></i>
    </a>
    <a v-else class="nav-link" @click="app.to(data.path)">
      <i :class="data.style && data.style.icon"></i>
      <span>{{ data.name || (data.style && data.style.name) || data.path }}</span>
    </a>
    <ul
      v-if="hasChildren"
      class="dropdown-menu"
      :style="{ height: show ? data.children.length * 35 + 'px' : '0' }"
    >
      <li :class="{ active: active(item) }" v-for="item in data.children" :key="item.name">
        <a class="nav-link" @click="app.to(item.path)">
          {{ item.name || (item.style && item.style.name) || item.path }}
        </a>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
type Menu = { name?: string; path?: string; style?: Record<string, any>; children?: Menu[] }

@Component({
  components: {},
  setup(props, context) {},
})
export default class extends Vue {
  @Prop() data: Menu
  get hasChildren() {
    return !!this.data?.children?.length
  }
  show = false

  active(e: Menu) {
    return e.children?.some((e) => e.path == getApp()._route.path) || e.path == getApp()._route.path
  }
}
</script>

<style lang="scss">
.dropdown-menu {
  display: block !important;
  height: 0;
  overflow: hidden;
  transition: all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1);

  li a {
    padding-left: 80px !important;
  }
}
</style>
