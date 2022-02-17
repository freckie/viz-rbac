import * as d3 from 'd3'

const createHeatmap = (svgId, 
  { xlabels, ylabels, data },
  calcColorFn,
  breakStringFn
  ) => {
    // Const variables
    const cellSize = 17
    const labelFontsize = 13
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }

    // Compute values
    const svgWidth = 928
    const svgHeight = cellSize * (ylabels.length + 2)

    // Clear svg
    d3.select(svgId).selectAll('svg > *').remove()

    // Create svg element
    const svg = d3.select(svgId)
      .append('svg')
        .attr('width', svgWidth + margin.left + margin.right)
        .attr('height', svgHeight + margin.top + margin.bottom)
      .append('g')
        .attr('transform', "translate(" + margin.left + "," + margin.top + ")")

    // Create cells
    data.forEach((rowValue, j) => {
      let yValue = j * cellSize + 1
      const row = svg.append('g')
          .attr('class', 'row')
          .attr('x', 1)
          .attr('y', yValue)

      let label = breakStringFn(ylabels[j])
      row.append('text')
          .attr('x', -20 - label.length)
          .attr('y', yValue + labelFontsize)
          .attr('font-weight', '400')
          .attr('font-size', labelFontsize)
          .text(label)
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
          .attr('fill', d => calcColorFn(d))
      
      // To Do :: Show xlabels on mouse hover event
      console.log(xlabels)
    })
  }

export { createHeatmap }