$(document).ready(function () {

  var FilmFinder = function () {

    var vidContent = $("#vid-content");
    var filmContent = $("#film-content");

    var search_arr = "";

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
      saveSearches($("#input-search").val());
      $("#input-search").val('');
    }

    function navSearch(e) {
      e.preventDefault();
      searchBtnPress($("#query").val());
      saveSearches($("#query").val());
      $("#query").val('');
    }

    function relFilmSearch(e) {
      e.preventDefault();
      searchBtnPress($(this).attr("title"));
    }

    function searchBtnPress(q) {
      clearPage();
      searchOMDB(q);
      searchYT(q, 11);
      //
      
      pageView();
    }


    function searchOMDB(movie) {
      var url = "https://api.themoviedb.org/3/search/movie";
      var obj = {
        query: movie,
        api_key: "67c6def7e44101cc4b977b7aa552d028"
      };
      url += '?' + $.param(obj);
      // 
      $.ajax({
        url: url,
        method: "GET"
      }).then(function (response) {
         console.log(response);
        addMovieInfo(response.results[0]);

        database.ref("/searches").push({
          image: response.results[0].poster_path,
          title: resopnse.results[0].original_title,
        });

        //
        for (var i = 1; i < response.results.length; i++) {
          // console.log(response.results[i])
          addRelatedFilmTB(response.results[i]);
        }
        //
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

    function addMovieInfo(obj) {
      $("#bio-title").text(obj.original_title);
      $("#bio-small").text("Rating: " + obj.vote_average);
      $("#bio-subtitle").text("Released: " + moment(obj.release_date).format('MMMM Do, YYYY'));
      $(".card-text").text(obj.overview);
      $("#bio-img").attr("src", "https://image.tmdb.org/t/p/w1280/" + obj.poster_path);
      //
      $("#content").css({
        "background": `url("https://image.tmdb.org/t/p/w1280/` + obj.backdrop_path + `") no-repeat center center fixed`, "background-size": "cover"
      });
      //
      search_arr.img = obj.poster_path;
      addRecentSearch(obj);
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

    function modalVid(e) {
      e.preventDefault();
      var vidID = $(this).attr("data-vidID");
      var title = $(this).attr("title");
      console.log(vidID);
      $(".modal-title").text(title);
      $(".modal-body").html(`<iframe width="800" height="500" src="https://www.youtube.com/embed/` + vidID + `"></iframe>`);
    }

    function addRecentSearch(obj) {
      makeVis("prev-search", true);
      var div = $("<div>").attr({ "title": obj.text, "id": "recentTB" });
      div.css({
        "background": `url("https://image.tmdb.org/t/p/w1280/` + obj.img + `") no-repeat top center`,
        "background-size": "100%"
      });
      div.addClass("img-fluid rounded-circle m-2");
      div.on("click", relFilmSearch);
      $("#recent-content").prepend(div);
    }

    function clearPage() {
      filmContent.empty();
      vidContent.empty();
      $("#modal-body").empty();
    }

    function welcomeView() {
      // 
      makeVis("welcome-search", true);
      $("#content").addClass("fixed-height");
      $("footer").addClass("fixed-bottom");
      //
      makeVis("navbarSearch", false);
      makeVis("page-content", false);
      makeVis("prev-search", false);
    }

    function pageView() {
      // 
      makeVis("welcome-search", false);
      $("#content").removeClass("fixed-height");
      $("footer").removeClass("fixed-bottom")
      //
      makeVis("navbarSearch", true);
      makeVis("page-content", true);
    }



    function makeVis(id, val) {
      if (val)
        $("#" + id).removeClass("d-none");
      else
        $("#" + id).addClass("d-none");
    }

    /*======================================== */
    /*===============  FiREBASE  ================= */
    /*======================================== */

    var config = {
      apiKey: "AIzaSyAjLL5b07IVCDO-ZAXzNbEZR9gsaxZ_2fA",
      authDomain: "june-2018-48693.firebaseapp.com",
      databaseURL: "https://june-2018-48693.firebaseio.com",
      projectId: "june-2018-48693",
      storageBucket: "june-2018-48693.appspot.com",
      messagingSenderId: "977127869466"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    $("#login-submit").on("click", function (e) {
      e.preventDefault();
      var email = $("#input-email").val().trim();
      var password = $("#input-password").val().trim();
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {

        var errorCode = error.code;
        var errorMessage = error.message;

      });
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {

        var errorCode = error.code;
        var errorMessage = error.message;

      });
    });

    var user = firebase.auth().currentUser;
    if (user != null) {
      email = user.email;
    }

    function saveSearches(input) {
      search_arr = "";
      var user = firebase.auth().currentUser;
      if (user != null) {
        email = user.email;
      }

      if (input.length > 0 || input.length > 0) {
        search_arr = input;
      }
      database.ref("/searches").push({
        savedSearches: search_arr,
        userEmail: email,
      });
    }


    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        alert("user is signed in");
       // addRecentSearch();
      } else {
        alert("user is not signed in");
      }
    });

    database.ref("/searches").on("child_added", function(s) {
      console.log(s.val());
      addRecentSearch();
    });


    // using local storage - store email to local storage and firebase. store search data to firebase. 
    //when user loads page, retrieve search data by matching email from local storage to firebase

  };

  var myFinder = new FilmFinder();
  myFinder.start();

  // $(document).keyup(function (e) {
  //   console.log(e.key);
  //   if (e.key === "w")
  //     myFinder.welView();
  //   else if (e.key === "v")
  //     myFinder.pgView();


  //
  //
  // end
});