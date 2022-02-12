<template>
  <v-app>
    <SideBar id="sidebar" />
    <v-content>
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
}
</style>