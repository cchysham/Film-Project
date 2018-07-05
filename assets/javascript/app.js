$(document).ready(function () {

  var FilmFinder = function () {

    var email;
    var grav_key;

    var vidContent = $("#vid-content");
    var filmContent = $("#film-content");

    var search_arr = [];

    this.start = init;
    this.welView = welcomeView;
    this.pgView = pageView;


    function init() {
      console.log("ready");
    }

    /*======================================== */
    /*===============  FiREBASE  ================= */
    /*======================================== */

    var config = {
      apiKey: "AIzaSyBnggAKB5THl-nfZxmnAO5QR4g5eHRvpI8",
      authDomain: "filmfinder-d741e.firebaseapp.com",
      databaseURL: "https://filmfinder-d741e.firebaseio.com",
      projectId: "filmfinder-d741e",
      storageBucket: "filmfinder-d741e.appspot.com",
      messagingSenderId: "272003219933"
    };
    firebase.initializeApp(config);

    //
    $("#login-submit").on("click", userLogin);
    $("#logout-submit").on("click", userLogOut);

    function userLogin(e) {
      e.preventDefault();
      var email = $("#input-email").val().trim();
      var password = $("#input-password").val().trim();
      $("#input-email").val('');
      $("#input-password").val('');
      //
      $("#loginCollapse").collapse('toggle');
      //
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {

        console.log("signin", error.code, error.message);

        if (error.code == "auth/user-not-found") {
          console.log("send to create user", email, password);
          createUser(email, password);
        }

      });
    };

    function userLogOut(e) {
      e.preventDefault();
      $("#loginCollapse").collapse('toggle');
      //
      firebase.auth().signOut().then(function () {
        makeVis("login", true);
        makeVis("logout-submit", false);
        //
        setUserIcon(false);
        search_arr = [];
        $("#recent-content").empty();
        makeVis("prev-search", false);
      }).catch(function (error) {
        // An error happened.
        console.log(error);
      });
    }

    function createUser(email, password) {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {

        console.log("create user", error.code, error.message);

      });
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("user is signed in");
        email = user.email;
        //
        search_arr = (user.displayName === undefined) ? [] : JSON.parse(user.displayName);
        // search_arr = (user.savedSearches == undefined) ? [] : user.savedSearches;
        $.each(search_arr, function (i, val) {
          addRecentSearch(val);
        });
        //
        grav_key = $.md5(email);
        setUserIcon(true);
        // 
        console.log(email, search_arr, grav_key, user.displayName);

        //
        makeVis("login", false);
        makeVis("logout-submit", true);

      } else {
        console.log("user is not signed in");
      }
    });


    function updateUser() {
      //
      var user = firebase.auth().currentUser;
      if (user !== null) {
        user.updateProfile({
          displayName: JSON.stringify(search_arr)
        }).then(function () {
          // Update successful.
        }).catch(function (error) {
          // An error happened.
          console.log(error);
        });
      }
    }


    /*======================================== */
    /*===============  SEARCH  =============== */
    /*======================================== */

    $("#search-button").on("click", navSearch);
    $("#wSearch-btn").on("click", welSearch);


    function welSearch(e) {
      e.preventDefault();
      searchBtnPress($("#input-search").val().trim());
      $("#input-search").val('');
      $("#input-search").val('');
    }

    function navSearch(e) {
      e.preventDefault();
      searchBtnPress($("#query").val().trim());
      $("#query").val('');
      $("#searchCollapse").collapse('toggle');
    }

    function relFilmSearch(e) {
      e.preventDefault();
      $(this).remove();
      searchBtnPress($(this).attr("title"));
    }

    function searchBtnPress(q) {
      clearPage();
      rmvDuplicateSearches(q);
      searchOMDB(q);
      searchYT(q, 11);
      //
      search_arr.unshift({ text: q, img: undefined });
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
        console.log(response.results.length);
        if (response.results.length === 0) {
          console.log("ZERO RESULTS");
          zeroResultsView();
        } else {
          pageView();
          //
          addMovieInfo(response.results[0], movie);

          //
          for (var i = 1; i < response.results.length; i++) {
            console.log(response.results[i])
            addRelatedFilmTB(response.results[i]);
          }
          //
          var val = ($("#film-content > div").length > 0);
          makeVis("film-content", val);
          makeVis("filmTab-title", val);
        }

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
        // console.log(response);
        for (var i = 0; i < limit; i++) {
          addThumb(response.items[i]);
        }
      });
    }

    /*======================================== */
    /*===============  VIEW  ================= */
    /*======================================== */

    function setUserIcon(val) {
      if (val) {
        $("#login-icon").html(`<img src="https://www.gravatar.com/avatar/` + grav_key + `?s=40" class="rounded-circle">`);
      } else {
        $("#login-icon").html(`<i class="fas fa-user-circle"></i>`);
      }
    }

    function addMovieInfo(obj) {
      $("#bio-title").text(obj.original_title);
      $("#bio-small").text("Rating: " + obj.vote_average);
      $("#bio-subtitle").text("Released: " + moment(obj.release_date).format('MMMM Do, YYYY'));
      $(".card-text").text(obj.overview);
      $("#bio-img").attr("src", "https://image.tmdb.org/t/p/w1280/" + obj.poster_path);
      //
      if (obj.backdrop_path !== undefined) {
        $("#content").css({
          "background": `url("https://image.tmdb.org/t/p/w1280/` + obj.backdrop_path + `") no-repeat center center fixed`, "background-size": "cover"
        });
      }
      //
      search_arr[0].img = obj.poster_path;
      updateUser();
      addRecentSearch(search_arr[0]);
      makeVis("prev-search", true);
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
      if (obj === undefined) return;
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
      //
      $(".modal-title").text(title);
      $(".modal-body").html(`<iframe width="100%" height="500" src="https://www.youtube.com/embed/` + vidID + `"></iframe>`);
    }

    function addRecentSearch(obj) {
      var div = $("<div>").attr({ "title": obj.text, "id": "recentTB" });
      div.css({
        "background": `url("https://image.tmdb.org/t/p/w1280/` + obj.img + `") no-repeat top center`,
        "background-size": "100%"
      });
      div.addClass("img-fluid rounded-circle m-2");
      div.on("click", relFilmSearch);
      $("#recent-content").prepend(div);
    }

    function rmvDuplicateSearches(str) {
      //
      var temp_arr = [];
      $.each(search_arr, function (i, val) {
        if (val.text !== str) {
          temp_arr.push(val);
        } 
      });
      search_arr = temp_arr;
      // console.log(search_arr);
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
      makeVis("zeroResults", false);

    }

    function zeroResultsView() {
      makeVis("welcome-search", false);
      $("#content").addClass("fixed-height");
      $("footer").addClass("fixed-bottom");
      makeVis("page-content", false);
      makeVis("zeroResults", true);
      makeVis("prev-search", false);
      $("#searchCollapse").collapse('toggle');
      $("#content").css({
        "background": `none`
      });
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