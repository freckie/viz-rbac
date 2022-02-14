<template>
  <div id="d3-wrapper">
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'DashboardHeatmap',
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
    generateHeatmap() {
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

      // Const variables
      const cellSize = 17
      const labelFontsize = 13
      const margin = { top: 50, right: 50, bottom: 50, left: 50 }
      const calcColor = this.calcColor

      // Data
      const _ns = dummy['ns1']
      let _x = new Set()
      for (const [k, v] of Object.entries(_ns)) {
        Object.keys(_ns[k]).forEach(it => _x.add(it))
      }
      const XLabels = Array.from(_x)
      const YLabels = Object.keys(_ns)
      const Values = YLabels.map(y => XLabels.map(x => _ns[y][x]))
      
      // Compute values
      const svgWidth = 928
      const svgHeight = cellSize * (YLabels.length + 2)

      // Create svg element
      const svg = d3.select('#d3-wrapper')
        .append('svg')
          .attr('width', svgWidth + margin.left + margin.right)
          .attr('height', svgHeight + margin.top + margin.bottom)
        .append('g')
          .attr('transform', "translate(" + margin.left + "," + margin.top + ")")

      // Create cells
      Values.forEach((rowValue, j) => {
        let yValue = j * cellSize + 1
        const row = svg.append('g')
            .attr('class', 'row')
            .attr('x', 1)
            .attr('y', yValue)

        row.append('text')
            .attr('x', -40)
            .attr('y', yValue + labelFontsize)
            .attr('font-weight', '400')
            .attr('font-size', labelFontsize)
            .text(YLabels[j])
          .enter()
        
        row.selectAll('.cell')
          .data(rowValue)
          .enter()
          .append('rect')
            .attr('class', 'cell')
            .attr('x', (d, i) => i * cellSize + 1)
            .attr('y', yValue)
            .attr('width', cellSize - 1)
            .attr('height', cellSize - 1)
            .attr('fill', d => calcColor(d))
      })
    }
  }
}
</script>
