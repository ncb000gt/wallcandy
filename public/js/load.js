$(document).ready(function() {
  $.get(window.location.href + '/data', function(data) {
    line(data);
  });
});
