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
          prepend-icon="mdi-laptop"
          title="ServiceAccounts Panel"
          :to="links.sa"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="UserAccounts Panel"
          :to="links.ua"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-certificate-outline"
          title="CSR Panel"
          :to="links.csr"
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
        sa: '/sa',
        ua: '/ua',
        csr: '/csr'
      }
    }
  }
}
</script>