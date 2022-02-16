<template>
  <div id="d3-wrapper">
  </div>
</template>

<script>
import { createHeatmap } from "@/utils/heatmap"

export default {
  name: 'Heatmap',
  props: {
    namespace: String
  },
  data: () => {
    return {
    }
  },
  mounted() {
    this.generateHeatmap()
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
    getData() {
      const dummy = JSON.parse(`
        {
          "ns1": {
            "sa1": {
              "res11": ["get", "list", "watch"],
              "res12": ["get", "list", "watch"],
              "res13": ["get", "list", "watch", "update", "delete"],
              "res14": ["get", "list", "watch"]
            },
            "sa2": {
              "res11": [],
              "res12": [],
              "res13": ["get", "list", "watch", "update", "delete"],
              "res14": ["get", "list", "watch"],
              "res15": ["get", "list", "watch"]
            },
            "sa3": {
              "res14": [],
              "res15": ["get", "list", "watch", "update"]
            },
            "sa4": {
              "res11": ["get"],
              "res12": [],
              "res13": ["get", "list", "watch", "update", "delete"],
              "res14": ["get", "list", "watch"],
              "res15": ["get", "list", "watch"],
              "res16": ["get", "list", "watch", "update"],
              "res17": ["get", "list", "watch", "patch"],
              "res18": ["get", "list", "watch", "update", "patch", "create", "delete", "deletecollection"],
              "res19": ["get", "list", "watch"]
            },
            "sa5": {
              "res11": ["get"],
              "res12": ["get"]
            }
          }
        }`)
      
      // Data
      const _ns = dummy[this.namespace]
      let _x = new Set()
      for (const [k, v] of Object.entries(_ns)) {
        Object.keys(_ns[k]).forEach(it => _x.add(it))
      }
      const xlabels = Array.from(_x)
      const ylabels = Object.keys(_ns)
      const data = ylabels.map(y => xlabels.map(x => _ns[y][x]))

      return { xlabels, ylabels, data }
    },
    generateHeatmap() {
      createHeatmap('#d3-wrapper', this.getData(), this.calcColor, this.breakString)
    }
  }
}
</script>
