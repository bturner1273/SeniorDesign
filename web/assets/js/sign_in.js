window.onload = function () {

    $("#show_password").click(function () {
        var i_tag = $(this).find("i").get(0);
        var i_tag_class = $(i_tag).attr("class");
        if (i_tag_class === "fal fa-eye") {
            $(i_tag).attr("class", "fal fa-eye-slash");
            $("#password").attr("type", "password");
        }else {
            $("#password").attr("type", "text");
            $(i_tag).attr("class", "fal fa-eye");
        }
    });


}
