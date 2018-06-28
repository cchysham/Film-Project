$(document).ready(function () {

    var FilmFinder = function () {

        this.start = init;

        this.welcomeView = function () {
            makeVis("login", true);
            makeVis("welcome-search", true);
            //
            makeVis("navbarSearch", false);
            makeVis("page-content", false);
        }

        this.pageView = function () {
            makeVis("login", false);
            makeVis("welcome-search", false);
            //
            makeVis("navbarSearch", true);
            makeVis("page-content", true);
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