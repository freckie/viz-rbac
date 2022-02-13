<template>
  <v-card>
    <v-navigation-drawer
      theme="dark"
      permanent
    >
      <v-list nav>
        <v-list-item
          title="viz-rbac Dashboard"
        >
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          prepend-icon="mdi-home"
          title="Welcome!"
          :to="links.home"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-chart-bar"
          title="Dashboard"
          :to="links.dashboard"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'SideBar',
  data: () => {
    return {
      links: {
        home: '/home',
        dashboard: '/dashboard'
      }
    }
  }
}
</script>