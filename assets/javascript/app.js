$(document).ready(function () {

  var FilmFinder = function () {

    var vidContent = $("#vid-content");

    this.start = init;
    this.welView = welcomeView;
    this.pgView = pageView;

    function init() {
      console.log("ready");
    }

    /*======================================== */
    /*===============  SEARCH  =============== */
    /*======================================== */

    $("#search-button").on("click", searchBtnPress);
    $("#wSearch-btn").on("click", searchBtnPress);

    function searchBtnPress(e) {
      e.preventDefault();
      var q = $("#query").val();
      $("#query").val('');
      //
      searchYT(q, 11);

      //
      pageView();
    }


    function searchYT(query, limit) {
      var url = "https://www.googleapis.com/youtube/v3/search";
      var obj = {
        part: 'snippet',
        key: 'AIzaSyCu5-okTOpJ9J0XeEWjW-FHemPiCUhWJ5E',
        q: query
      };
      url += '?' + $.param(obj);
      $.ajax({
        url: url,
        method: "GET"
      }).then(function (response) {

        console.log(response);
        clearPage();
        for (var i = 0; i < limit; i++) {
          addVid(response.items[i].id.videoId);
        }
      });
    }

    /*======================================== */
    /*===============  VIEW  ================= */
    /*======================================== */

    function addVid(vidID) {
      var div = $("<div>").addClass("col-4 text-center");
      div.append(`<iframe src="https://www.youtube.com/embed/` + vidID + `"></iframe>`);
      vidContent.append(div);
    }

    function clearPage() {
      vidContent.empty();
    }

    function welcomeView() {
      makeVis("login", true);
      makeVis("welcome-search", true);
      $("#content").addClass("fixed-height");
      $("footer").addClass("fixed-bottom");
      //
      makeVis("navbarSearch", false);
      makeVis("page-content", false);
      makeVis("prev-search", false);
    }

    function pageView() {
      makeVis("login", false);
      makeVis("welcome-search", false);
      $("#content").removeClass("fixed-height");
      $("footer").removeClass("fixed-bottom")
      //
      makeVis("navbarSearch", true);
      makeVis("page-content", true);
      makeVis("prev-search", true);
    }



    function makeVis(id, val) {
      if (val)
        $("#" + id).removeClass("d-none");
      else
        $("#" + id).addClass("d-none");
    }

    //
    //
    // end
  }

  var myFinder = new FilmFinder();
  myFinder.start();

  $(document).keyup(function (e) {
    console.log(e.key);
    if (e.key === "w")
      myFinder.welView();
    else if (e.key === "v")
      myFinder.pgView();
  })

  //
  //
  // end
});