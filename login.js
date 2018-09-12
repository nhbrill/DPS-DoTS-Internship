function checkLogin() {
    $("#load").css("display", "block");
    var username = $("#username").val();
    var password = $("#password").val();
    var output = {
        username: username, password: password
    };
    console.log(output);
    var jsonData = JSON.stringify(output, null, 2);

    $.ajax({
        url: "api/Login",
        data: jsonData,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, xhr) {
            $("#load").css("display", "none");
            console.log("Success." + xhr.textStatus);
            console.log(output);
            console.log(data);
            if (data === 200) {
                //$("#user").text("username");
                window.location = "admin.html";
            } else if (data === 401) {
                $("#errors").html("Invalid username/password.");
                console.log("Unauthorized");
            }
        }
    });
}

function register() {
    $("#load").css("display", "block");
    var username = $("#username").val();
    var password = $("#password").val();
    var output = {
        username: username, password: password
    };
    console.log(output);
    var jsonData = JSON.stringify(output, null, 2);
    
    $.ajax({
        url: "api/Register",
        data: jsonData,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, xhr) {
            $("#load").css("display", "none");
            console.log("Success." + xhr.textStatus);
            console.log(output);
            console.log(data);

            if (data === 201) {
                $("#errors").html("Successfully registered. Contact an administrator to gain admin status. <strong>Be sure to go into your profile and verify your email address</strong>.");
            } else if (data === 409) {
                $("#errors").html("Unable to make account: account already exists.");
            } else if (data === 406) {
                $("#errors").html("Unable to make account: Username must be longer than 1 character and Password must be longer than 6 characters.");
            }
        },
        error: function (err) {
            $("#load").css("display", "none");
            $("#errors").html("Error registering account.");
        }
    });
}

$(document).keypress(function (e) {
    if (e.which == 13) {
        checkLogin();
    }
});