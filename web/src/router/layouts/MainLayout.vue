<template>
  <v-app>
    <SideBar id="sidebar" />
    <v-main id="app-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import SideBar from '../../components/SideBar.vue'

export default {
  name: 'MainLayout',
  components: {
    SideBar
  }
}
</script>

<style>
#sidebar {
  position: fixed;
  display: block;
  z-index: 1000;
}

#app-main {
  width: 100%;
  margin: 0 auto;
}
</style>
