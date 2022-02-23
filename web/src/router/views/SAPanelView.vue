<template>
  <div>
    <v-toolbar
      id="top-bar"
      absolute
      dark
      dense
      height="48"
    >
      <v-col
        cols="6"
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

    <div id="heatmap-wrapper">
      <Heatmap ref="heatmap" />
    </div>
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
  watch: {
    namespace(newVal) {
      this.$refs.heatmap.generateHeatmap('sa-res', newVal)
    }
  },
  mounted() {
    this.setNamespaces()
  },
  methods: {
    setNamespaces() {
      const vm = this
      const host = this.$host

      if (host == undefined || host == null || host == '') {
        alert('API Host is not set yet.')
        this.$router.push('/setting')
        return
      }

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

#heatmap-wrapper {
  margin-top: 48px;
}
</style>