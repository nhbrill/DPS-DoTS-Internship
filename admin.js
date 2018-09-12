document.body.setAttribute("onload", "loadJSON('api/values/')"); // On load, check auth and load data from dbd

var db; // Holds data gotten from database
function checkAuth(url) {
    $("#load").css("display", "block"); // Show loading wheel

    // AJAX request to LoginController: check if you are logged in
    $.ajax({
        url: "api/Login",
        type: "GET",
        success: function (response) {
            // response[0] - True if logged in, false if not
            // response[1] - If logged in, is the name of currently signed in user. If not, is ""
            // response[2] - If logged in, if the user is an admin, is true, or if the user is a user, is false, or if not logged in, is undefined
            console.log(response);

            // If you aren't logged in, go to login page
            if (response[0] === false) {
                window.location = "login.html";
            } else { // If you are logged in
                $("#user").html("Hello, " + response[1]); // Display username in top right corner

                $.ajax({
                    url: "api/UserInfo/" + response[1],
                    type: "GET",
                    success: function (email) {
                        $("#email").val(email);
                    }
                });

                // 2nd AJAX request to values controller to get data from db
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function (response) {
                        $("#load").css("display", "none"); // Hide spinning wheel

                        if (response !== null) { // response will be null if you aren't authenticated for some reason
                            console.log(response);
                            db = [];
                            db = response; // Store data
                            populateList(response); // Puts data in drop down list
                        } else {
                            $("#errors").css("display", "block");
                        }
                    },
                    error: function (err) {
                        $("#load").css("display", "none");
                        //alert("error");
                    }
                });
            }
        },
        // If error connecting to DB, show error
        error: function (err) {
            //alert("error");
        }
    });
}
//printer function 1
function printer() {
    window.print();
}

function loadJSON(url) {
    checkAuth(url);
}
//school list
var sels = ["", "ACE Community Challenge School", "Abraham Lincoln", "Academia Ana Marie Sandoval", "Academy 360", "Academy of Urban Learning", "Accountability, Research & Evaluation",
    "Accounting Operations", "Accounts Payable", "Amesse", "Arts", "Asbury", "Ashley", "Athletics & Sports Schedules", "Balarat Outdoor Education Center", "Barnum", "Beach Court",
    "Bear Valley International School", "Board of Education", "Bond & Mill Levy", "Bradley International School", "Bromwell", "Brown International Academy", "Bruce Randolph High School",
    "Bruce Randolph Middle School", "Bryant-Webster Dual Language ECE-8 School", "Business Diversity Outreach", "CMS Community School", "Calendars",
    "Call for New Quality Schools", "Career & Technical Education", "Career Education Center Early College", "CareerConnect", "Careers", "Carson", "Castro", "Centennial",
    "Cesar Chavez Academy", "Cheltenham", "Child Find", "Choice & Enrollment Services", "Cole Arts & Science Academy", "Colfax", "College & Career Readiness",
    "College View", "Collegiate Preparatory  Academy", "Colorado High School Charter - Race Street", "Colorado High School Charter", "Columbian", "Columbine", "Communications", "Community Partnerships",
    "Community Use: Using a DPS Facility", "Compass Academy MS", "Compassion Road Academy", "Contemporary Learning Academy HS", "Contemporary Learning Academy MS", "Cory",
    "Cowell", "Creativity Challenge Community (C3)", "Culture, Equity & Leadership Team", "Curriculum & Instruction", "DCIS at Fairmont", "DCIS at Ford",
    "DCIS at Montbello HS", "DCIS at Montbello MS", "DPS Foundation", "DSST: Byers HS", "DSST: Byers MS", "DSST: Cole HS", "DSST: Cole MS", "DSST: College View HS",
    "DSST: College View MS", "DSST: Conservatory Green HS", "DSST: Conservatory Green", "DSST: GVR HS", "DSST: GVR MS", "DSST: Henry MS", "DSST: Noel MS", "DSST: Stapleton HS",
    "DSST: Stapleton MS", "Dance", "Denison Montessori", "Denver Center For International Studies HS", "Denver Center For International Studies MS", "Denver Center for 21st-Century Learning at Wyman HS",
    "Denver Center for 21st-Century Learning at Wyman MS", "Denver Discovery School", "Denver Fellows", "Denver Green School", "Denver Justice HS", "Denver Language School",
    "Denver Montessori Junior HS", "Denver Montessori Senior HS", "Denver Online High School", "Denver School of Innovation and Sustainable Design", "Denver School of the Arts HS",
    "Denver School of the Arts MS", "Discovery Link", "Donations", "Dora Moore", "Doull", "Downtown Denver Expeditionary School MS", "Downtown Denver Expeditionary School",
    "Dr. Martin Luther King Jr. Early College HS", "Dr. Martin Luther King, Jr. Early College MS", "Eagleton", "Early Childhood Education", "East", "Ed. Technology & Library Services",
    "Edison", "Ellis", "Emily Griffith High School", "Emily Griffith Technical College", "English Language Acquisition", "Enterprise Management", "Equity Initiatives",
    "Escalante-Biggs Academy", "Excel Academy - Denver", "Extended Learning", "Facilities Management", "Fairview", "Family and Community Engagement", "Farrell B. Howell",
    "Federal Programs", "Financial Services", "Flexibility", "Florence Crittenton", "Florida Pitt Waller", "Food & Nutrition Services", "Force", "GW Career Academy",
    "Garden Place", "George Washington", "Gifted & Talented Students", "Gilliam School ES", "Gilliam School HS", "Gilliam School MS", "Gilpin Montessori Public School", "Girls Athletic Leadership HS",
    "Girls Athletic Leadership MS", "Godsman", "Goldrick", "Grant Beacon", "Grant Ranch", "Grants Administration", "Green Valley", "Greenlee", "Gust", "Hallett Academy",
    "Hamilton", "Healthy Schools", "Henry World Middle School", "High Tech Early College", "High Tech Elementary", "Highline Academy Northeast", "Highline Academy Southeast",
    "Hill Campus of Arts & Sciences", "Holm", "Homeless Education Network", "Human Resources", "Imaginarium", "Inspire Elementary School", "Internal Auditing",
    "International Academy of Denver at Harrington", "Isabella Bird Community School", "JROTC/Military Programs", "Joe Shoemaker School", "John F. Kennedy", "Johnson", "KIPP Denver Collegiate High School",
    "KIPP Montbello College Prep", "KIPP Montbello Elementary", "KIPP Northeast Denver Leadership Academy", "KIPP Sunshine Peak Academy", "Kaiser", "Kepner Beacon MS",
    "Kepner", "Knapp", "Kunsmiller Creative Arts Academy ES", "Kunsmiller Creative Arts Academy HS", "Kunsmiller Creative Arts Academy MS", "Lake International School",
    "Lead in Denver", "Leadership Development", "Leading Effective Academic Practice (LEAP)", "Legacy Options High School", "Lena Archuleta", "Lincoln Elementary",
    "Lowry", "Manual", "Marie L. Greenwood Academy", "Marrama", "Math and Science Leadership Academy", "Maxwell", "McAuliffe International School", "McAuliffe Manual Middle School",
    "McGlone Academy", "McKinley-Thatcher", "McMeen", "Media Relations", "Medicaid", "Mental Health & Assessment Services", "Merrill", "Migrant Education", "Monarch Montessori",
    "Montbello Career and Technical High School", "Montclair School of Academics & Enrichment", "Morey", "Munroe", "Music", "Native American Education Program", "Neighborhood Centers",
    "New Teachers", "Newlon", "Noel Community Arts School HS", "Noel Community Arts School MS", "North High School Engagement Center", "North", "Northfield High School",
    "Nursing Services", "Oakland", "Odyssey School of Denver", "Omar D. Blair", "P.R.E.P. Academy HS", "P.R.E.P. Academy MS", "Palmer", "Parent/Student Portal", "Park Hill",
    "Pascual LeDoux Academy", "Payroll", "Physical Education (P.E.)", "Place Bridge Academy", "Planning & Analysis", "Polaris Elementary School", "Portfolio Management: Charter/Innovation Schools",
    "Prep League (Middle School Sports)", "Procomp", "Professional Learning Center", "Psychological Services", "Pupil Assistance Fund", "REACH", "Respect Academy",
    "Ricoh Service Center", "Ridge View Academy", "RiseUp Community HS", "Risk Management", "Rocky Mountain Prep Creekside", "Rocky Mountain Prep Southwest", "Rocky Mountain School of Expeditionary Learning",
    "Roots Elementary", "SOAR at Green Valley Ranch", "STRIVE Prep - Excel", "STRIVE Prep - Federal", "STRIVE Prep - Green Valley Ranch", "STRIVE Prep - Kepner", "STRIVE Prep - Lake",
    "STRIVE Prep - Montbello", "STRIVE Prep - Rise", "STRIVE Prep - Ruby Hill", "STRIVE Prep - SMART Academy", "STRIVE Prep - Sunnyside", "STRIVE Prep - Westwood",
    "STRIVE Prep FNE ES", "STRIVE Prep SW ES", "Sabin World School", "Safety", "Samuels", "Sandra Todd-Williams Academy", "Schmitt", "School Performance Framework (SPF)",
    "School Turnaround", "Skinner", "Slavens", "Smith", "Social Work Services", "South", "Southmoor", "Southwest Early College", "Special Education", "Steck", "Stedman",
    "Steele", "Stephen Knight Center for Early Education", "Strategic Sourcing (Purchasing)", "Student Equity & Opportunity", "Student Records", "Student Submissions",
    "Summit Academy HS", "Summit Academy MS", "Swansea", "Swigert International School", "Teacher Leadership", "Technology Services", "Teller", "The Boys School of Denver",
    "Theatre", "Thomas Jefferson", "Tiered Support Framework", "Transportation Services", "Traylor Academy", "Treasury Services",
    "Trevista at Horace Mann", "University Park", "University Prep - Arapahoe St.", "University Prep - Steele St.", "Valdez", "Valverde", "Venture Prep HS",
    "Vista Academy HS", "Vista Academy MS", "Volunteer Services", "West Career Academy", "West Early College HS", "West Early College MS", "West Leadership Academy HS",
    "West Leadership Academy MS", "Westerly Creek", "Whittier", "Whole Child", "William (Bill) Roberts", "Work in DPS", "Wyatt Academy", "Other" ];
var option = '';
for (var i = 0; i < sels.length; i++) {
    option += '<option value="' + sels[i] + '">' + sels[i] + '</option>';
}
$('#sds').append(option);
// Fill <select> drop down with each document from db
function populateList(data) {
    var needsApproved = 0;
    var approvalString = "";
    $("#documents").html(null); // Clear out list so if you press reload, items aren't duplicated

    for (var i = 0; i < data.length; i++) { // Loop though documents
        // Get date, or user place holder if it doesn't exist
        var date = data[i].dateMain;
        if (date === "") {
            date = "Unknown Date";
        }

        // Get school, or user place holder if it doesn't exist
        var school = data[i].school;
        if (school === "") {
            school = "Unknown School";
        }

        // If document needs approval from admin, highlight it in red
        if (data[i].approved === "") {
            needsApproved++;
            approvalString = "  (Needs Approval)";
            $("#documents").append(new Option(date + ": " + school + approvalString, i));
            $("#documents option:last").css("color", "red");
        } else { // Otherwise show it normally
            approvalString = "";
            $("#documents").append(new Option(date + ": " + school + approvalString, i));
        }
    }

    // Take total number of docs that need approval and show that in <p>
    if (needsApproved === 0) { 
        $("#needsApproved").parent().hide();
    } else {
        $("#needsApproved").html(needsApproved);
    }
    
}

// Fill out form with selected document
var selected = 0;
function listChange() {
    selected = $("#documents")[0].selectedIndex;
    $(".toggleable").each(function () { $(this).removeAttr('disabled'); });
    //$("#item1").html(JSON.stringify(db[index], null, 2));
    insertData(db[selected]);
}

// Put data into form
function insertData(form) {
    rows.school(form.school);
    rows.siteCode(form.siteCode);
    rows.dateMain(form.dateMain);
    rows.documentNumber(form.documentNumber);
    rows.fadDoc(form.fadDoc);
    rows.transfer(form.transfer);
    rows.warehouse(form.warehouse);
    rows.forRD(form.forRD);
    rows.policeCase(form.policeCase);
    rows.policeDate(form.policeDate);
    rows.policeFile(form.policeFile);
    rows.warranty(form.warranty);
    rows.remarks(form.remarks);
    rows.purchase(form.purchase);
    rows.credit(form.credit);
    rows.contact(form.contact);
    rows.phone(form.phone);
    rows.email(form.email);
    rows.approved(form.approved);
    rows.aDate(form.aDate);
    rows.received(form.received);
    rows.rDate(form.rDate);
    rows.deliveredBy(form.deliveredBy);
    rows.deliveredDate(form.deliveredDate);
    rows.recordsBy(form.recordsBy);
    rows.recordsDate(form.recordsDate);

    var numRows = 1;
    $(".btn-warning").each(function () { this.click(); }); // For every yellow button (remove buttons), click them so you have 0 rows left
    for (var i = 0; form.rows.length; i++) { // Add a new row for each row in the document
        dev.devise.push({
            barCode: form.rows[i].barcode,
            itemDescription: form.rows[i].itemDescription,
            make: form.rows[i].make,
            model: form.rows[i].model,
            serial: form.rows[i].serial,
            serviceable: form.rows[i].serviceable
        });
    }
}

//Script languages= Javascript, Jquery, Knockout, and Bootstrap
//Section Devise
function rateIt() {
    $('.telko').toggleClass('tan');
    $("#end").submit(function (ethree) {
        ethree.preventDefault();
    });
}
function collapsep() {
    $('.collapse').collapse('show');
}
var initialData = [
    { barCode: "", itemDescription: "", make: "", model: "", serial: "", serviceable: false }
];

// Viewmodel for Device Row
var DeviseModel = function (devise) {
    var self = this;
    self.devise = ko.observableArray(ko.utils.arrayMap(devise, function (devise) {
        return { barCode: devise.barCode, itemDescription: devise.itemDescription, make: devise.make, model: devise.model, serial: devise.serial, serviceable: devise.serviceable };
    }));

    self.addTab = function () {
        self.devise.push({
            barCode: "",
            itemDescription: "",
            make: "",
            model: "",
            serial: "",
            serviceable: false
        });
    };
    self.removeDevise = function (devise) {
        self.devise.remove(devise);
    };
    self.save = function () {
        self.lastSavedJson(JSON.stringify(ko.toJS(self.devise), null, 2));
    };

    self.saveJSON = function () {
        return self.devise();
    };

    self.lastSavedJson = ko.observable("");
};

//Section rows
var rows = {
    school: ko.observable(""),
    siteCode: ko.observable(""),
    dateMain: ko.observable(""),
    documentNumber: ko.observable(""),
    fadDoc: ko.observable(""),
    transfer: ko.observable(""),
    warehouse: ko.observable(false),
    forRD: ko.observable(""),
    policeCase: ko.observable(""),
    policeDate: ko.observable(""),
    policeFile: ko.observable({
        dataURL: ko.observable(),
    }),
    warranty: ko.observable(""),
    remarks: ko.observable(""),
    purchase: ko.observable(""),
    credit: ko.observable(""),
    contact: ko.observable(""),
    phone: ko.observable(""),
    email: ko.observable(""),
    approved: ko.observable(""),
    aDate: ko.observable(""),
    received: ko.observable(""),
    rDate: ko.observable(""),
    deliveredBy: ko.observable(""),
    deliveredDate: ko.observable(""),
    recordsBy: ko.observable(""),
    recordsDate: ko.observable(""),
    rows: ko.observableArray() // Will be empty until submit is pressed
};

// Format and submit JSON
function binder() {
    rows.rows = dev.devise(); // Push viewmodel data into rows array with the resot of the data
    var jsonData = JSON.stringify(ko.toJS(rows), null, 2); // Format into JSON
    console.log(jsonData);
    submitJSON("api/values/" + db[selected]._id, jsonData);
}
//Section Devise
var dev = new DeviseModel(initialData);
ko.applyBindings(dev);

function submitJSON(url, output) {
    $("#load").css("display", "block"); // Show loading wheel
    $.ajax({
        url: url,
        data: output,
        type: "PUT", // Update
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        complete: function (xhr, status) {
            $("#load").css("display", "none"); // Hide loading wheel
            if (xhr.status === 401) { // If Unauthorized
                console.log(xhr.status);
                $("#pageOne").hide(); // PageOne is initial form
                $("#pageTwo").show(); // PageTwo is success/error screen
                $("#submitMsg").css("color", "red");
                $("#submitMsg").html("You must log in as an admin to do that.");
            } else {
                console.log("Success");
                $("#submitMsg").css("color", "#337ab7");
                $("#submitMsg").html("Your form has successfully been updated.");
                $("#pageOne").hide();
                $("#pageTwo").show();
            }
        }
    });
}

function deleteForm() {
    // Similar to submitJSON
    $("#load").css("display", "block");
    $.ajax({
        url: "api/values/" + db[selected]._id,
        type: "DELETE",
        complete: function (xhr, status) {
            $("#load").css("display", "none");
            if (xhr.status === 401) {
                console.log(xhr.status);
                $("#pageOne").hide();
                $("#pageTwo").show();
                $("#submitMsg").css("color", "red");
                $("#submitMsg").html("You must log as an admin in to do that.");
            } else {
                console.log("Success");
                $("#submitMsg").css("color", "#337ab7");
                $("#submitMsg").html("The form has been successfully deleted.");
                $("#pageOne").hide();
                $("#pageTwo").show();
            }
        }
    });
}

// Barcode scanner
function decode(source, element) {
    var barcode = 0;
    Quagga.decodeSingle({
        decoder: {
            readers: ["code_39_reader"] // Type of all DPS barcodes
        },
        locate: true, // try to locate the barcode in the image
        src: source // or 'data:image/jpg;base64,' + data
    }, function (result) {
        if (result.codeResult) { // If decode was successful
            console.log(result.codeResult.code);
            barcode = result.codeResult.code;
            $(element).prev().val(barcode); // In DOM, for each row, Barcode field is always before file input (element points towards file input)
            dev.devise()[$(element).parent().parent().index()].barCode = barcode; // Find which row the file input is in, and update ko to have that value (it doesn't update automatically for some reason)
        } else {
            console.log("error");
        }
    });
}

// Get file for barcode scanner to decode
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            //$('#blah').attr('src', e.target.result);
            decode(e.target.result, input);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function signOut() {
    $.ajax({
        url: "api/Roles/1",
        type: "DELETE",
        complete: function (res, textStatus, xhr) {
            window.location = "login.html"; // Go to login screen
        }
    });
}

function getEmail() {
    
}