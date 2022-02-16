<template>
  <v-app>
    <SideBar id="sidebar" />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from '@/components/SideBar.vue'

export default {
  name: 'App',
  components: {
    SideBar
  }
}
</script>

<style>
#sidebar {
  position: fixed;
  height: 100%;
  z-index: 100;
}
</style>