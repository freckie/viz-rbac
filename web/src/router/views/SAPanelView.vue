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
        dense
        label="Select Namespace .."
        hide-details
      >
      </v-select>
    </v-col>

    </v-toolbar>

    <Heatmap :namespace="namespace"/>
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
      namespaces: ['none']
    }
  },
  methods: {
    getNamespaces() {
      const vm = this
      const host = this.$host

      this.$axios.get(host + '/api/res/v1/namespaces')
        .then((resp) => {
          vm.namespaces = resp.data.data.namespaces
        })
        .catch((error) => {
          console.log('[ERROR]', error)
          alert('Unexpected error.')
        })
    }
  }
}
</script>

<style scoped>
#top-bar {
  width: 100%;
}
</style>