$(document).ready(function () {
    $("#sign_out").click(function () {
        sign_out();
    });

    function sign_out () {
        firebase.auth().signOut().then(function () {

        }).catch(function (err) {

        });
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log(user);
        console.log(user.email);
      } else {
        // No user is signed in.
        window.location = "/";
      }
    });

});
