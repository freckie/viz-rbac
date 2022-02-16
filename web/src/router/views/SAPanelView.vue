<template>
  <div>
    <v-toolbar
      id="top-bar"
      absolute
      dark
      dense
    >
      
    <v-col
      cols="6"
      sm="3"
    >
      <v-select
        v-model="namespace"
        :items="namespaces"
        single-line
        label="Select Namespace .."
        hide-details
      >
      </v-select>
    </v-col>

    </v-toolbar>

    <Heatmap namespace="ns1"/>
  </div>
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
      namespace: '',
      namespaces: ['ns1', 'ns2']
    }
  }
}
</script>

<style scoped>
#top-bar {
  width: 100%;
}
</style>