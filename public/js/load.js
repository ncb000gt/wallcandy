function load(graph) {
  $.get(window.location.href + '/data/' + graph, function(data) {
    line(graph, data);
  });
};

function loadType(type) {
  var graphs = $('.graphs');
  $.get(window.location.href + '/../../type/' + type, function(type) {
    var len = type.graphs.length;
    for (var i = 0; i < len; i++) {
      var graph = type.graphs[i];
      $('<div class="' + graph + '"></div>').appendTo(graphs);
      load(graph);
    }
  });
}

$(document).ready(function() {
  loadType(type); //embedded in the page?
});
