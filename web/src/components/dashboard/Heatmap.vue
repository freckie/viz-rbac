<template>
  <div id="d3-wrapper">
  </div>
</template>

<script>
import { createHeatmap } from "@/utils/heatmap"

export default {
  name: 'Heatmap',
  data: () => {
    return {
      namespace: '',
      heatmapKind: ''
    }
  },
  methods: {
    calcColor(verbs) {
      // rgb(39, 100, 25)
      if (verbs == undefined || verbs.length == 0) return '#27641910' // .0

      let verbsSet = new Set(verbs)
      if (verbsSet.has("delete") || verbsSet.has("deletecollection")) {
        return '#276419' // 1.00
      } else if (verbsSet.has("update") || verbsSet.has("create") || verbsSet.has("patch")) {
        return '#276419a8' // .66
      } else if (verbsSet.has("get") || verbsSet.has("list") || verbsSet.has("watch")) {
        return '#27641954' // .33
      } else {
        return '#27641910' // .16
      }
    },
    breakString(str) {
      const limit = 7
      const _fn = (str, limit) => (str.length <= limit) ? str : (str.substr(0, limit) + '...')
      return _fn(str, limit)
    },
    getData(heatmapKind, namespace) {
      return new Promise((resolve, reject) => {
        const host = this.$host
        var _ns

        // Axios
        this.$axios.get(host + '/api/agg/v1/heatmap/' + heatmapKind + '/' + namespace)
          .then((resp) => {
            _ns = resp.data.data

            // Data
            let _x = new Set()
            for (const [k] of Object.entries(_ns)) {
              Object.keys(_ns[k]).forEach(it => _x.add(it))
            }
            const xlabels = Array.from(_x)
            const ylabels = Object.keys(_ns)
            const data = ylabels.map(y => xlabels.map(x => _ns[y][x]))

            resolve({ xlabels, ylabels, data })
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    generateHeatmap(heatmapKind, namespace) {
      this.heatmapKind = heatmapKind
      this.namespace = namespace

      this.getData(heatmapKind, namespace)
        .then(data => {
          createHeatmap('#d3-wrapper', data, this.calcColor, this.breakString)    
        })
        .catch((error) => {
          console.log('[ERROR]', error)
          alert('Unexpected error occurred.')
        })
    }
  }
}
</script>

<style scoped>
#d3-wrapper {
  width: 90%;
  margin: 0 auto;
}
</style>
