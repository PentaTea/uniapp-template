<template>
  <div class="navbar">
    <div class="navbar-content flex-center justify-between" v-if="ROUTE">
      <div @click="openSidebar">
        <i class="ri-function-fill"></i>
        <div>{{ ROUTE.name || (ROUTE.style && ROUTE.style.name) || ROUTE.path }}</div>
      </div>
      <div>
        <div class="user-menu flex-center" @click="openUserMenu">
          <img alt="image" src="/avatar.png" class="rounded-circle margin-right-sm" />
          <div class="margin-right-sm">Hi, {{ userInfo.username }}</div>
          <i class="ri-arrow-drop-down-line"></i>
          <div class="dropdown-menu dropdown-menu-right" @click.stop>
            <div class="dropdown-title">
              Logged in
              {{
                app &&
                  app
                    .time(userInfo.last_login_date)
                    .locale('en')
                    .fromNow()
              }}
            </div>
            <a href="features-profile.html" class="dropdown-item has-icon">
              <i class="far fa-user"></i> Profile
            </a>
            <a href="features-activities.html" class="dropdown-item has-icon">
              <i class="fas fa-bolt"></i> Activities
            </a>
            <a href="features-settings.html" class="dropdown-item has-icon">
              <i class="fas fa-cog"></i> Settings
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item has-icon text-danger">
              <i class="ri-logout-box-r-line"></i> Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {},
  setup(props, context) {},
})
export default class extends Vue {
  get ROUTE() {
    console.log(
      ROUTES,
      ROUTES.find((e) => e.path == getApp()._route.path)
    )

    return ROUTES.find((e) => e.path == getApp()._route.path)
  }
  openSidebar() {
    document.querySelector('body').classList.add('sidebar-show')
  }
  get userInfo() {
    return app?.User.userInfo
  }
  //   showUserMenu = false
  //   openUserMenu() {
  //     if (this.showUserMenu) document.querySelector('.user-menu').classList.remove('active')
  //     else document.querySelector('.user-menu').classList.add('active')
  //     this.showUserMenu = !this.showUserMenu
  //   }
  openUserMenu() {
    document.querySelector('.user-menu').classList.add('active')
    document.addEventListener('click', function(e) {
      if (e.target['className'] != 'user-menu') {
        document.querySelector('.user-menu').classList.remove('active')
      }
    })
  }
}
</script>

<style lang="scss">
.navbar {
  position: fixed;
  right: 0;
  left: 0;
  height: 70px !important;
  padding: 0;
  background-color: $top-window-bg-color;
  background-color: #42b883;
  box-sizing: border-box;
  transition: all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1) !important;

  &[showleftwindow] {
    left: 240px;
  }
}

.uni-top-window--placeholder {
  height: 70px !important;
}
// body.sidebar-show .navbar:not([showleftwindow]) {
//   left: 240px;
// }
.navbar-content {
  width: 100%;
  padding: 0 20px;
  font-size: 18px;
  color: white;

  [class*='ri-'] {
    font-size: 20px;
  }

  img {
    width: 30px;
  }

  > div {
    display: flex;
    align-items: center;

    > * {
      padding-right: 20px;

      &:last-child {
        padding-right: 0;
      }
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;

    [class*='ri-'] {
      font-size: 14px;
    }
  }

  .user-menu .dropdown-menu {
    top: calc(100% - 10px);
    right: 20px;
    display: block;
    width: 200px;
    min-width: fit-content;
    pointer-events: none;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1);

    &::after {
      position: absolute;
      top: -30px;
      bottom: 100%;
      content: '';
      inset: 0;
    }
  }

  .user-menu:hover .dropdown-menu {
    pointer-events: auto;
    opacity: 1;
  }
}
</style>
