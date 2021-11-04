<template>
  <div class="sidebar" @click="click">
    <aside class="main-sidebar" id="sidebar-wrapper" @click.stop>
      <div class="sidebar-brand"><a>4chiao</a></div>
      <div class="sidebar-brand sidebar-brand-sm">
        <a>4chiao</a>
      </div>
      <ul class="sidebar-menu">
        <template v-for="item in baseMenu">
          <TitleMenuSidebar :title="item.name" :key="item.name" />
          <MenuItem v-for="menu in item.children" :key="menu.name" :data="menu" />
        </template>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TitleMenuSidebar from './components/TitleMenuSidebar.vue'
import MenuItem from './components/MenuItem.vue'

@Component({
  components: {
    TitleMenuSidebar,
    MenuItem,
  },
  setup(props, context) {},
})
export default class extends Vue {
  baseMenu = [
    {
      name: 'test',
      children: ROUTES.filter((e) => e.path.split('/')[2] == 'admin'),
    },
  ]
  ROUTES = ROUTES.find((e) => e.path.split('/')[2] == 'admin')
  click() {
    document.querySelector('body').classList.remove('sidebar-show')
  }
}
</script>

<style lang="scss">
.sidebar {
  position: fixed;
  // top: var(--top-window-height);
  top: 0;
  z-index: 1000;
  width: 0;
  box-sizing: border-box;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 1000px;
    height: 100vh;
    pointer-events: none;
    background: #000;
    content: '';
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
  }

  #sidebar-wrapper {
    position: fixed;
    left: 0;
    z-index: 1000;
    width: 240px;
    height: 100vh;
    padding-bottom: 10px;
    // right: 0;
    overflow: hidden;
    background-color: $left-window-bg-color;
    border-right: 1px solid darken($left-window-bg-color, 8%);
    transform: translateX(-100%);
    transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1);
  }

  &[showleftwindow] {
    width: 240px;

    #sidebar-wrapper {
      transform: translateX(0);
    }
  }
}

body.sidebar-show .sidebar:not([showleftwindow]) {
  &::before {
    pointer-events: auto;
    content: '';
    opacity: 0.5;
  }

  #sidebar-wrapper {
    transform: translateX(0) !important;
  }
}

.title {
  margin-left: 5px;
}
</style>
