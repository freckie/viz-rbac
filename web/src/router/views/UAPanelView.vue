<template>
  <div>
    <v-toolbar
      id="top-bar"
      absolute
      dark
      dense
      height="48"
    >
      <!-- Namespace Control -->
      <v-col cols="6">
        <v-select
          v-model="namespace"
          :items="namespaces"
          :disabled="zoomLevel == 0 ? true : false"
          single-line
          dense
          label="Select Namespace .."
          hide-details
        >
        </v-select>
      </v-col>

      <v-spacer />

      <!-- Zoom Control -->
      <v-col cols="3">
        <v-row>
          <!-- Zoom Out -->
          <v-col cols="1">
            <v-btn
              icon
              color="white"
              :disabled="zoomLevel == 0 ? true : false"
              @click="changeZoomLevel(false)"
            >
              <v-icon>mdi-minus-box</v-icon>
            </v-btn>
          </v-col>

          <!-- Zoom Icon -->
          <v-col cols="1">
            <v-btn icon color="white" disabled>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>

          <!-- Zoom In -->
          <v-col cols="1">
            <v-btn
              icon
              color="white"
              :disabled="zoomLevel == 0 ? false : true"
              @click="changeZoomLevel(true)"
            >
              <v-icon>mdi-plus-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-toolbar>

    <div id="heatmap-wrapper">
      <Info
        title="The target namespace is not selected."
        ref="info"
        :show-on-mounted="false"
      />
      <Heatmap ref="heatmap" />
    </div>
  </div>
</template>

<script>
import Info from '@/components/Info.vue'
import Heatmap from '@/components/dashboard/Heatmap.vue'

export default {
  name: 'UAPanelView',
  components: {
    Info,
    Heatmap
  },
  data: () => {
    return {
      zoomLevel: 0,
      namespace: '',
      namespaces: ['none']
    }
  },
  watch: {
    zoomLevel(newLevel) {
      if (newLevel == 0) {
        this.$refs.info.hide()
        this.generateUserNSHeatmap()
        this.namespace = ''
      } else if (newLevel == 1) {
        this.$refs.info.show()
        this.setNamespaces()
        this.namespace = ''
      }
    },
    namespace(newNS) {
      if (this.zoomLevel == 1) {
        if (this.namespace == undefined || this.namespace == null || this.namespace == '') {
          this.$refs.info.show()
        } else {
          this.$refs.info.hide()
          this.$refs.heatmap.generateHeatmap('user-res', newNS, this._calcColorForUserRes)
        }
      }
    }
  },
  mounted() {
    this.generateUserNSHeatmap()
  },
  methods: {
    changeZoomLevel(isZoomIn) {
      if (isZoomIn) {
        this.zoomLevel++
        this.$refs.heatmap.clear()
      }
      else this.zoomLevel--
    },
    generateUserNSHeatmap() {
      const host = this.$host
      if (host == undefined || host == null || host == '') {
        alert('API Host is not set yet.')
        this.$router.push('/setting')
        return
      }
      this.$refs.heatmap.generateHeatmap('user-ns', '', this._calcColorForUserNS)
    },
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
    _calcColorForUserNS(cnt) {
      const colorList = ['#27641907', '#27641954', '#276419a8', '#276419'] // rgb(39, 100, 25)

      if (cnt == undefined || cnt < 1) return colorList[0]
      else if (1 <= cnt < 2) return colorList[1]
      else if (2 <= cnt < 10) return colorList[2]
      else if (10 <= cnt < 20) return colorList[3]
      else return colorList[0]
    },
    _calcColorForUserRes(verbs) {
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