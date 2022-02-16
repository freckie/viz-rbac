<template>
  <v-layout>
    <v-app-bar
      id="top-bar"
      density="compact"
      absolute
      dark
    >
      <v-app-bar-title>ServiceAccount Panel</v-app-bar-title>
      
      <v-spacer />

      <!-- Todo: Namespace Selection -->
      <!-- -->
    </v-app-bar>

    <v-main id="main-wrapper">
      <Heatmap namespace="ns1"/>
    </v-main>
  </v-layout>
</template>

<script>
import Heatmap from '@/components/dashboard/Heatmap.vue'

export default {
  name: 'SAPanelView',
  components: {
    Heatmap
  },
  data: () => {
    return {
      namespaces: ['ns1', 'ns2']
    }
  }
}
</script>

<style scoped>
#top-bar {
  width: 100%;
}

#main-wrapper {
  width: 90%;
  margin: 0 auto;
}
</style>