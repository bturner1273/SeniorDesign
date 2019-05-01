$(document).ready(function () {
    //binds the login form to submit on enter key press in the password text input
    addInputSubmitEvent($("#sign_up_form"), $("#sign_up_password"));
    addInputSubmitEvent($("#sign_in_form"), $("#password"));
    bind_show_password("show_password","password");
    bind_show_password("sign_up_show_password", "sign_up_password");

    //toggles whether password will show or not
    function bind_show_password(button_id, text_input_id) {
        $("#"+button_id).click(function () {
            var i_tag = $(this).find("i").get(0);
            var i_tag_class = $(i_tag).attr("class");
            if (i_tag_class === "fal fa-eye") {
                $(i_tag).attr("class", "fal fa-eye-slash");
                $("#"+text_input_id).attr("type", "password");
            }else {
                $("#"+text_input_id).attr("type", "text");
                $(i_tag).attr("class", "fal fa-eye");
            }
        });
    }

    $("#sign_in_form").on("submit", function (event) {
        event.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(
            function (user) {
                console.log(user);
            }
        )
        .catch(
            function (err) {
                console.log(err);
            }
        )
    });

    $("#sign_up_form").on("submit", function (event) {
        event.preventDefault();
        var email = $("#sign_up_email").val();
        var password = $("#sign_up_password").val();

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(
            function (user) {
                sign_up = true;
                console.log(user);
            }
        )
        .catch(
            function (err) {
                console.log(err);
            }
        )
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (sign_up) {
            //push user to db
            uid = user.uid;
            firebase.database().ref("private/users/" + user.uid).set({
                email: user.email
            });
        }
        // User is signed in.
        window.location = "home.html";
      }
    });

    function addInputSubmitEvent(form, input) {
        input.onkeydown = function(e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                form.submit();
                return false;
            }
        };
    }
});
