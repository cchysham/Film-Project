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

    $("#search-button").on("click", navSearch);
    $("#wSearch-btn").on("click", welSearch);

    function welSearch(e) {
      e.preventDefault();
      searchBtnPress($("#input-search").val());
      $("#input-search").val('');
    }

    function navSearch(e) {
      e.preventDefault();
      searchBtnPress($("#query").val());
      $("#query").val('');
    }

    function searchBtnPress(q) {
      searchOMDB(q);
      searchYT(q, 11);
      //
      pageView();
    }

    // http://www.omdbapi.com/?i=tt3896198&apikey=f1c265cf
    function searchOMDB(movie) {
      var url = "https://api.themoviedb.org/3/search/person";
      var obj = {
        query: movie,
        api_key: "67c6def7e44101cc4b977b7aa552d028"
      }
      url += '?' + $.param(obj);
      // Creating an AJAX call for the specific movie button being clicked
      $.ajax({
        url: url,
        method: "GET"
      }).then(function (response) {
        console.log(response);
        addMovieInfo(response.results[0]);
      });

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

    function addMovieInfo(obj) {
      $("#bio-title").text(obj.original_title);
      $("#bio-small").text("Rating: " + obj.vote_average);
      $("#bio-subtitle").text("Released: " + obj.release_date);
      $(".card-text").text(obj.overview);
      $("#bio-img").attr("src", "https://image.tmdb.org/t/p/w1280/" + obj.poster_path);
    }

    function addVid(vidID) {
      var div = $("<div>").addClass("card m-2");
      var a = $("<a>").attr({ "data-toggle": "modal", "data-target": "#vidModal", "data-vidID": vidID });
      a.append(`<iframe src="https://www.youtube.com/embed/` + vidID + `"></iframe>`);
      a.on("click", modalVid);
      div.append(a);
      vidContent.append(div);
    }

    function modalVid(e) {
      e.preventDefault();
      var vidID = $(this).attr("data-vidID");
      console.log(vidID);
      $(".modal-body").html(`<iframe width="800" height="500" src="https://www.youtube.com/embed/` + vidID + `"></iframe>`);
    }

    function clearPage() {
      vidContent.empty();
    }

    function welcomeView() {
      // makeVis("login", true);
      makeVis("welcome-search", true);
      $("#content").addClass("fixed-height");
      $("footer").addClass("fixed-bottom");
      //
      makeVis("navbarSearch", false);
      makeVis("page-content", false);
      makeVis("prev-search", false);
    }

    function pageView() {
      // makeVis("login", false);
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

  // $(document).keyup(function (e) {
  //   console.log(e.key);
  //   if (e.key === "w")
  //     myFinder.welView();
  //   else if (e.key === "v")
  //     myFinder.pgView();
  // })

  //
  //
  // end
});