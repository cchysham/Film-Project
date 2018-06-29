$(document).ready(function () {
  var userInput = "";
  $("#search-button").on("click", function (event) {
    event.preventDefault();
    var searchVal = $("#query").val();
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + searchVal + "&key=AIzaSyCu5-okTOpJ9J0XeEWjW-FHemPiCUhWJ5E"
    $.ajax({
      url: url,
      method: "GET"
    }).then(function (response) {
      $("#film-content2").empty();
      for (var i = 0; i < 3; i++) {
        console.log(response);
        userInput = response.items[i].snippet.thumbnails.high;
        console.log(userInput);
        $("#film-content2").append(`<div class="col-4 text-center"><iframe width="300" height="200" src="https://www.youtube.com/embed/` + userInput + `"></iframe></div>`);
      }
    });
  });
<iframe width="300" height="200" src="https://www.youtube.com/embed/` + userInput + `"></iframe>
  var FilmFinder = function () {

    this.start = init;

    this.welcomeView = function () {
      makeVis("login", true);
      makeVis("welcome-search", true);
      $("#content").addClass("fixed-height");
      $("footer").addClass("fixed-bottom");
      //
      makeVis("navbarSearch", false);
      makeVis("page-content", false);
      makeVis("prev-search", false);
    }

    this.pageView = function () {
      makeVis("login", false);
      makeVis("welcome-search", false);
      $("#content").removeClass("fixed-height");
      $("footer").removeClass("fixed-bottom")
      //
      makeVis("navbarSearch", true);
      makeVis("page-content", true);
      makeVis("prev-search", true);
    }

    function init() {
      console.log("ready");
    }

    function makeVis(id, val) {
      if (val)
        $("#" + id).removeClass("d-none");
      else
        $("#" + id).addClass("d-none");
    }

  }

  var myFinder = new FilmFinder();
  myFinder.start();

  $(document).keyup(function (e) {
    console.log(e.key);
    if (e.key === "w")
      myFinder.welcomeView();
    else if (e.key === "v")
      myFinder.pageView();
  })

  //
  //
  // end
});