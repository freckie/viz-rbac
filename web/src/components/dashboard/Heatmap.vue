<template>
  <div id="d3-wrapper">
  </div>
</template>

<script>
import { clearHeatmap, createHeatmap } from "@/utils/heatmap"

export default {
  name: 'Heatmap',
  data: () => {
    return {
      namespace: '',
      heatmapKind: ''
    }
  },
  methods: {
    getData(heatmapKind, namespace) {
      return new Promise((resolve, reject) => {
        const host = this.$host
        var _ns, url

        clearHeatmap('#d3-wrapper')

        // Axios
        if (heatmapKind == 'user-ns') {
          url = host + '/api/agg/v1/heatmap/' + heatmapKind
        } else {
          url = host + '/api/agg/v1/heatmap/' + heatmapKind + '/' + namespace
        }
        this.$axios.get(url)
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
    clear() {
      clearHeatmap('#d3-wrapper')
    },
    generateHeatmap(heatmapKind, namespace, colorFn) {
      this.heatmapKind = heatmapKind
      this.namespace = namespace

      this.getData(heatmapKind, namespace)
        .then(data => {
          createHeatmap('#d3-wrapper', data, colorFn, this._breakString)    
        })
        .catch((error) => {
          console.log('[ERROR]', error)
          alert('Unexpected error occurred.')
        })
    },
    _breakString(str) {
      const limit = 7
      const _fn = (str, limit) => (str.length <= limit) ? str + '   ' : (str.substr(0, limit) + '...')
      return _fn(str, limit)
    }
  }
}
</script>

<style lang="scss" scoped>
#d3-wrapper {
  width: 100%;
  overflow-x: scroll;
  overflow-y: scroll;

  .ylabel {
    cursor: pointer;
  }
}
</style>