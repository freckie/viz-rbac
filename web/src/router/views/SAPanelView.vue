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
      this.$refs.heatmap.generateHeatmap('sa-res', newVal, this._calcColor)
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
    },
    _calcColor(verbs) {
      const colorList = ['#27641907', '#27641954', '#276419a8', '#276419'] // rgb(39, 100, 25)

      if (verbs == undefined || verbs.length == 0) return colorList[0]

      let verbsSet = new Set(verbs)
      if (verbsSet.has("delete") || verbsSet.has("deletecollection")) {
        return colorList[3]
      } else if (verbsSet.has("update") || verbsSet.has("create") || verbsSet.has("patch")) {
        return colorList[2]
      } else if (verbsSet.has("get") || verbsSet.has("list") || verbsSet.has("watch")) {
        return colorList[1]
      } else {
        return colorList[0]
      }
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