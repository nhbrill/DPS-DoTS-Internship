function checkLogin() {
    $("#load").css("display", "block");
    var username = $("#username").val();
    var email = $("#email").val();

    var output = {
        email: email
    }

    var jsonData = JSON.stringify(output, null, 2);

    $.ajax({
        url: "api/UserInfo/" + username,
        data: jsonData,
        type: "PUT", // Update
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        complete: function (response) {
            $("#load").css("display", "none");
            window.location = "login.html";
        }
    });
}