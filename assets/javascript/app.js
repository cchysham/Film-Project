$(document).ready(function(){
  var userInput = "";
  $("#search-button").on("click", function (event) {
      event.preventDefault();
      var searchVal = $("#query").val();
      var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + searchVal + "&key=AIzaSyCu5-okTOpJ9J0XeEWjW-FHemPiCUhWJ5E"
      $.ajax({
          url: url,
          method: "GET"
      }).then(function (response) {
        for (var i = 0; i<11; i++){
          console.log(response);
          console.log(response.items[i].id.videoId);
          userInput = response.items[i].id.videoId;
          console.log("Inside response" + userInput);
          $("#player").append(`<iframe width="420" height="315" src="https://www.youtube.com/embed/` + userInput + `"></iframe>`);
        }
      });
  });

});