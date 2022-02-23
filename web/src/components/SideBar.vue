<template>
  <v-card>
    <v-navigation-drawer
      dark
      hide-overlay
      app
      permanent
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            viz-rbac Dashboard
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
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
      items: [
        {
          title: 'Setting',
          icon: 'mdi-cog',
          link: '/setting'
        },
        {
          title: 'ServiceAccount Panel',
          icon: 'mdi-laptop',
          link: '/sa'
        },
        {
          title: 'UserAccount Panel',
          icon: 'mdi-account',
          link: '/ua'
        },
        {
          title: 'CSR Panel',
          icon: 'mdi-certificate-outline',
          link: '/csr'
        },
      ]
    }
  }
}
</script>