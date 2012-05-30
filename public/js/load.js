$(document).ready(function() {
  $.get(window.location.href + '/data/avg', function(data) {
    line(data);
  });
});
