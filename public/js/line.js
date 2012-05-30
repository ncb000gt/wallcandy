function line(data) {
  var w = 20,
      h = 100;

  var x = d3.scale.linear()
            .domain([0, 1])
            .range([0, w]);

  var y = d3.scale.linear()
            .domain([0, 100])
            .range([0, h]);

  var chart = d3.select('.graph').append('svg')
                .attr('class', 'chart')
                .attr('width', w * data.total - 1)
                .attr('height', h);

  chart.selectAll('rect')
       .data(data.plots)
       .enter().append('rect')
       .attr('x', function(d, i) { return x(i) - .5; })
       .attr('y', function(d) { return h - y(d.value) - .5; })
       .attr('width', w)
       .attr('height', function(d) { return y(d.value); });

  chart.append('line')
       .attr('x1', 0)
       .attr('x2', w * data.total)
       .attr('y1', h - .5)
       .attr('y2', h - .5)
       .style('stroke', '#000');
}
