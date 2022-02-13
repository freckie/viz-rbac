<template>
  <v-app>
    <SideBar id="sidebar" />
    <v-content id="main-content">
      <v-main>
        <router-view />
      </v-main>
    </v-content>
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

#main-content {
  width: 95%;
  margin: 0 auto;
}
</style>
