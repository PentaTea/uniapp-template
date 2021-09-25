<template>
  <li class="menu-header">{{ title }}</li>
</template>

<script>
export default {
  name: 'TitleMenuSidebar',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
