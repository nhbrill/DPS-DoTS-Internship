$(document).ready(getUser());
var username = "";

// See if user is logged in, and if they are, display their information.
function getUser() {
    $.ajax({
        url: "api/Login",
        type: "GET",
        success: function (response) { // Response format: [0]: True(Logged in)/False(Logged out) [1]: Username or "", [2]: Role (T-admin, F-user) or undefined
            $("#load").css("display", "none"); // Hiding loading wheel
            console.log(response);
            if (response[0] === false) { // If not logged in
                window.location = "login.html"; // Kick user to login page
            } else {
                username = response[1]; // Set global var for username
                $("#user").html("Hello, " + response[1]); // Show username in top right corner
                $("#userBig").html(response[1]); // Show h1 with username

                // Subheading with role

                if (response[2] === true) {
                    $("#role").html("Administrator");
                    dropDown(); // Populate drop down with list of users only if logged in as admin
                } else {
                    $("#role").html("User");
                }
            }
        },
        error: function () {
            console.log("error");
        }
    });
}

// Set new password in db
function updatePassword() {
    var password = $("#password").val(); // Get password from textbox

    var output = { // Turn user into object
        username: username,
        password: password
    };

    // Turn object into JSON
    console.log(output);
    var jsonData = JSON.stringify(output, null, 2);

    // Send new user info to db
    $.ajax({
        url: "api/Update/",
        data: jsonData,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        complete: function (res, textStatus, xhr) {
            var data = res.responseJSON;
            if (data === 200) { // OK
                $('.invad').toggleClass('vad');
                $("#errors").html("Successfully changed password.");
                console.log("Success.");
            } else if (data === 404) { // Not found
                $("#errors").html("Account was not found.");
                console.log("Not Found.");
            } else if (data === 406) { // Not acceptable
                $("#errors").html("New password must be longer than 6 characters.");
                console.log("Too short");
            } else if (data === 401) { // Unauthorized
                $("#errors").html("You must log in to do that.");
                console.log("Unauthorized");
                window.location = "login.html";
            }
        }
    });
}

// Delete Account
function deleteAccount() {
    if (confirm("Are you sure you want to delete the account " + username + "?")) { // Popup to confirm deletion

        $.ajax({
            url: "api/Register/" + username,
            type: "DELETE",
            complete: function (response, textStatus, xhr) {
                var data = response.responseJSON;
                if (data === 200) { // OK
                    $("#errors").html("Successfully deleted account.");
                    console.log("Success.");
                    window.location = "login.html";
                } else if (data === 404) { // Not Found
                    $("#errors").html("Account not found.");
                    console.log("Not Found.");
                } else if (data === 401) { // Unauthorized
                    $("#errors").html("You must log in to do that.");
                    console.log("Unauthorized");
                    window.location = "login.html";
                }
            }
        });
    }
}

// Populate drop odwn with list of users
var db;
function dropDown() {
    $("#elevator").show(); // Show drop down

    $.ajax({
        url: "api/Update",
        type: "GET",
        success: function (response) {
            console.log(response);
            db = response; // Get users from db, pw field will be null on all of them
            populateList(response); // Put users in drop down
        },
        error: function () {
            console.log("error");
        }
    });
}

// Put users list in drop down
function populateList(data) {
    // For every user
    for (var i = 0; i < data.length; i++) {
        if (true) { // Put every user in drop down except for logged in user so you don't accidentally make yourself a user
            $("select").append(new Option(data[i].username + ": " + data[i].role, i));
        }
    }
}

// Make selected user admin/user
function toggleRole() {
    var selected = $("select")[0].selectedIndex; // Get number of user

    // Switch the role the person is in
    var newRole;
    if (db[selected].role === "admin") {
        newRole = "user";
    } else {
        newRole = "admin";
    }

    // Turn user into object
    var output = {
        username: db[selected].username,
        role: newRole
    };

    // Turn object into JSON
    console.log(output);
    var jsonData = JSON.stringify(output, null, 2);


    // Update DB
    $.ajax({
        url: "api/Roles/",
        data: jsonData,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        complete: function (res, textStatus, xhr) {
            var data = res.responseJSON;
            if (data === 200) { // OK
                $('.invad').toggleClass('vad');
                $("#errors").html("Successfully made user " + db[selected].username + " a(n) " + newRole + ".");
                window.location.reload(); // So list stays accurate
            } else { // 401 Unauthorized
                $("#errors").html("You must log in to do that.");
            }
        }
    });
}

// Log out in top right
function signOut() {
    // In backend, will clear identity
    $.ajax({
        url: "api/Roles/1",
        type: "DELETE",
        complete: function (res, textStatus, xhr) {
            window.location = "login.html"; // Re login 
        }
    });
}

$(document).keypress(function (e) {
    if (e.which == 13) {
        updatePassword();
    }
});

function updateEmail() {
    var email = $("#email").val();

    var output = {
        username: username,
        email: email
    }

    console.log(output);
    var jsonData = JSON.stringify(output, null, 2);

    $.ajax({
        url: "api/UserInfo/",
        data: jsonData,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        complete: function (res, textStatus, xhr) {
            var data = res.responseJSON;
            if (data === 200) { // OK
                $("#errors").html("Successfully added email address to account.");
            } else {
                $("#errors").html("Unable to add email address to account.");
            }
        }
    });
}