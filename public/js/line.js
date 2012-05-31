function line(el, data) {
  var w = 20,
      h = 100;

  var x = d3.scale.linear()
            .domain([0, 1])
            .range([0, w]);

  var y = d3.scale.linear()
            .domain([0, 100])
            .range([0, h]);

  var chart = d3.select('.' + el).append('svg')
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

  chart.selectAll("text")
    .data(data.plots)
    .enter().append("text")
    .attr("x", function(d, i) { return x(i); })
    .attr("y", function(d) { return h + 20 - y(d.value); })
    .attr("dx", 0) // padding-right
    .attr("dy", -5) // vertical-align: middle
    .text(function(d) { return d.truevalue; });

  chart.append('line')
    .attr('x1', 0)
    .attr('x2', w * data.total)
    .attr('y1', h - .5)
    .attr('y2', h - .5)
    .style('stroke', '#000');
}
