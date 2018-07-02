$(document).ready(function () {

  var FilmFinder = function () {

    var vidContent = $("#vid-content");
    var filmContent = $("#film-content");

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

    function relFilmSearch(e) {
      e.preventDefault();
      console.log($(this).attr("title"));
      searchBtnPress($(this).attr("title"));
    }

    function searchBtnPress(q) {
      clearPage();
      searchOMDB(q);
      searchYT(q, 11);
      //
      pageView();
    }

    // http://www.omdbapi.com/?i=tt3896198&apikey=f1c265cf
    function searchOMDB(movie) {
      var url = "https://api.themoviedb.org/3/search/movie";
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

        //
        for (var i = 1; i < response.results.length; i++) {
          console.log(response.results[i])
          addRelatedFilmTB(response.results[i]);
        }
        console.log("length", $("#film-content > div").length);
        var val = ($("#film-content > div").length > 0);
        makeVis("film-content", val);
        makeVis("filmTab-title", val);
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
        for (var i = 0; i < limit; i++) {
          addThumb(response.items[i]);
        }
      });
    }

    /*======================================== */
    /*===============  VIEW  ================= */
    /*======================================== */

    function addThumb(obj) {
      var title = obj.snippet.title;
      var div = $("<div>").addClass("card position-relative vidTB m-2");
      var a = $("<a>").attr({
        "data-toggle": "modal",
        "data-target": "#vidModal",
        "data-vidID": obj.id.videoId,
        "title": title
      });
      var img = $("<img>").attr({
        "src": obj.snippet.thumbnails.medium.url,
        "alt": title,
        "class": "img-fluid",
        "id": "thumb"
      });
      a.append(img);
      div.append(a);
      div.append(`<p class="tbTitle">` + title + `</p>`);

      vidContent.append(div);
      a.on("click", modalVid);
    }

    function addMovieInfo(obj) {
      $("#bio-title").text(obj.original_title);
      $("#bio-small").text("Rating: " + obj.vote_average);
      $("#bio-subtitle").text("Released: " + moment(obj.release_date).format('MMMM Do, YYYY'));
      $(".card-text").text(obj.overview);
      $("#bio-img").attr("src", "https://image.tmdb.org/t/p/w1280/" + obj.poster_path);
      console.log(obj.backdrop_path);
      $("#content").css({ "background": `url("https://image.tmdb.org/t/p/w1280/` + obj.backdrop_path + `") no-repeat center center fixed`, "background-size": "cover" });
    }

    function addRelatedFilmTB(obj) {
      if (obj.poster_path == null) return;
      var div = $("<div>").addClass("card m-1 filmTB");
      div.attr("title", obj.original_title);
      div.append(`<img src="https://image.tmdb.org/t/p/w1280/` + obj.poster_path + `" alt="` + obj.original_title + `">`);
      div.append(`<p class="tbTitle">` + obj.original_title + `</p>`);
      div.on("click", relFilmSearch);
      filmContent.append(div);
    }

    function modalVid(e) {
      e.preventDefault();
      var vidID = $(this).attr("data-vidID");
      var title = $(this).attr("title");
      console.log(vidID);
      $(".modal-title").text(title);
      $(".modal-body").html(`<iframe width="800" height="500" src="https://www.youtube.com/embed/` + vidID + `"></iframe>`);
    }

    function clearPage() {
      filmContent.empty();
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