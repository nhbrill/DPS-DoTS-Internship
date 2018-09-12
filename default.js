//Script languages= Javascript, Jquery, Knockout, and Bootstrap
//Section Form (validation, layout).
$(document).ready(function () { rows.recordsDate(getDate()); rows.dateMain(getDate()); });
//Function gives access to certain areas and adds extra menu items based on user login.
function userIn() {
$.ajax({
    url: "api/Login",
    type: "GET",
    success: function (response) {
        console.log(response);
        if (response[0] === false) {
            $("#dd2").hide();
        } else if (response[2] === true) {
            $("#user").html("Hello, " + response[1])
            document.getElementById("xao").value = response[1];
            $(document).ready(function () { rows.aDate(getDate()); });
            $("#xao, #xbo, #xco, #xdo, #xeo, #xfo").prop("disabled", false);

            $.ajax({
                url: "api/UserInfo" + response[1],
                type: "GET",
                success: function (email) {
                    $("#email").val(email)
                }
            });

            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    if (response !== null) {
                        console.log(response);
                        db = [];
                        db = response;
                        populateList(response);
                    } else {
                        $("#errors").css("display", "block");
                    }
                },
                error: function (err) {
                    //alert("error");
                }
            });
        } else {
            $("#user").html("Hello, " + response[1]);
            $.ajax({
                url: "api/UserInfo/" + response[1],
                type: "GET",
                success: function (email) {
                    $("#email").val(email)
                }
            });
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    if (response !== null) {
                        console.log(response);
                        db = [];
                        db = response;
                        populateList(response);
                    } else {
                        $("#errors").css("display", "block");
                    }
                },
                error: function (err) {
                    //alert("error");
                }
            });
        }
    },
    error: function (err) {
        //alert("error");
    }
});
}
document.getElementById("pageTwo").style.display = "none";
document.getElementById("pageThree").style.display = "none";
function rateIt() {
    //adds validation classes
    $('.telko').toggleClass('tan');
    //allows user to save form
    $("#end").submit(function (ethree) {
        ethree.preventDefault();
        document.getElementById("btnSave").disabled = false;
    });
}
//used with collapsable items including the police report form attatchment option
function collapsep() {
    $('.collapse').collapse('show')
}
//adds site code & school values
//sels and site codes need to have matching indexes or else they won't use correct data. When adding a school add the corresponding site code in the stcd array on the same numerical index.
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
    "School Turnaround",  "Skinner",  "Slavens",  "Smith",  "Social Work Services",  "South",  "Southmoor",  "Southwest Early College",  "Special Education",  "Steck", "Stedman",
    "Steele", "Stephen Knight Center for Early Education", "Strategic Sourcing (Purchasing)", "Student Equity & Opportunity", "Student Records", "Student Submissions",
    "Summit Academy HS", "Summit Academy MS", "Swansea", "Swigert International School", "Teacher Leadership", "Technology Services", "Teller", "The Boys School of Denver",
    "Theatre", "Thomas Jefferson", "Tiered Support Framework", "Transportation Services", "Traylor Academy", "Treasury Services",
    "Trevista at Horace Mann", "University Park", "University Prep - Arapahoe St.", "University Prep - Steele St.", "Valdez", "Valverde", "Venture Prep HS",
    "Vista Academy HS", "Vista Academy MS", "Volunteer Services", "West Career Academy", "West Early College HS", "West Early College MS", "West Leadership Academy HS",
    "West Leadership Academy MS", "Westerly Creek", "Whittier", "Whole Child", "William (Bill) Roberts", "Work in DPS", "Wyatt Academy", "Other"];
//sets array equal to the options in the select for schools
var option = '';
for (var i = 0; i < sels.length; i++) {
    option += '<option value="' + sels[i] + '">' + sels[i] + '</option>';
}
$('#sds').append(option);
//array stcd contains the corresponding site codes for each school/department based on index
var stcd = ["", "1866", "0010", "6397", "0099", "0067", "", "", "", "0220", "", "0388", "0418", "", "", "0520", "0650", "1077", "", "", "0964", "1056", "1076", "6350", "6350", "1106", "", "", "", "", "", "1319",
    "", "", "1324", "9496", "1400", "1345", "1528", "", "", "1785", "1774", "", "1788", "1295", "1748", "1748", "1816", "1846", "", "", "", "1939", "1489", "5844", "5844", "1908", "1928", "3698", "", "", "", "2205", "2209", "2209", "", "2228", "2186",
    "2175", "2223", "4381", "4381", "2218", "2218", "2145", "2181", "2116", "", "2185", "2115", "", "2174", "2183", "2183", "2188", "2188", "", "2227", "", "2125", "2241", "2127", "2167", "2167", "6509", "2241", "2184", "", "", "6088", "2258", "2207", "2207", "5605",
    "5605", "2364", "", "2398", "", "2506", "2652", "2726", "2726", "", "", "", "2349", "2641", "", "", "2880", "", "4140", "", "", "", "3000", "6970", "", "3032", "", "3296", "3378", "", "", "", "", "3426", "3540", "3639", "3478",
    "3512", "3600", "3605", "", "3641", "3655", "3704", "4782", "3746", "", "8054", "2757", "3991", "4049", "3987", "3990", "4074", "", "", "", "", "", "3778", "4213", "", "4383", "4444", "4450", "4730", "4507", "4500", "4509", "4732", "4498", "", "", "4762", "4795",
    "4795", "4795", "5255", "", "", "", "5044", "3340", "5158", "5342", "5448", "3647", "5578", "5608", "5644", "5897", "5973", "5685", "5702", "5716", "", "", "", "5826", "", "5621", "", "6002", "6098", "6188", "", "", "", "", "6254", "6239", "6239",
    "6308", "6314", "6368", "", "8131", "6479", "6508", "7163", "7163", "6676", "", "6754", "7192", "", "", "7045", "", "2027", "", "", "", "", "", "", "7243", "7246", "", "0040", "7361", "", "7241", "7471", "", "7496", "8053", "8347", "8085",
    "9730", "7626", "9390", "9735", "7973", "8401", "9639", "9336", "9389", "", "", "", "", "7578", "2919", "7698", "", "", "7942", "7972", "8006", "", "8086", "8138", "8132", "", "8222", "8232", "8242", "8149", "", "", "", "", "8145", "8145", "8422",
    "8453", "", "", "8776", "", "", "8822", "", "", "8888", "", "8909", "8970", "8945", "6957", "0408", "9050", "2755", "8995", "8995", "", "9348", "9693", "9693", "9702", "9702", "9425", "9548", "", "9623", "", "9739", "" ]
//aligns the site code value with the school value (given as placeholders instead of values so knockout works)

function setSite() {
    var pointOne = document.getElementById("sds").value;
    var pointTwo = sels.indexOf(pointOne);
    $("#plas").val(stcd[pointTwo]);
    rows.siteCode(stcd[pointTwo]);
}
//print function 2
function reciept(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
}
//Section Devise
var initialData = [
    { barCode: "", itemDescription: "", make: "", model: "", serial: "", serviceable: false },
];
var DeviseModel = function (devise) {
    var self = this;
    //declares properties in object devise
    self.devise = ko.observableArray(ko.utils.arrayMap(devise, function (devise) {
        return { barCode: devise.barCode, itemDescription: devise.itemDescription, make: devise.make, model: devise.model, serial: devise.serial, serviceable: devise.serviceable };
    }));
    //adds table row and properties to a devise.
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

    self.CE = function () {
        $("#TI").val("Cellphone");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Cellphone";
        document.getElementById("TI").removeAttribute("id"); 
    }
    self.CA = function () {
        $("#TI").val("Camera");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Camera";
        document.getElementById("TI").removeAttribute("id"); 
    }
    self.PR = function () {
        $("#TI").val("Printer");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Printer";
        document.getElementById("TI").removeAttribute("id");
    }
    self.IT = function () {
        $("#TI").val("Modem");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Modem";
        document.getElementById("TI").removeAttribute("id");
    }
    self.AO = function () {
        $("#TI").val("Audio");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Audio";
        document.getElementById("TI").removeAttribute("id");
    }
    self.TE = function () {
        $("#TI").val("Telephone");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Telephone";
        document.getElementById("TI").removeAttribute("id");
    }
    self.MY = function () {
        $("#TI").val("Media Player");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Media Player";
        document.getElementById("TI").removeAttribute("id");
    }
    self.SN = function () {
        $("#TI").val("Screen");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Screen";
        document.getElementById("TI").removeAttribute("id");
    }
    self.LP = function () {
        $("#TI").val("Lamp");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "Lamp";
        document.getElementById("TI").removeAttribute("id");
    }
    self.PC = function () {
        $("#TI").val("PC");
        dev.devise()[$("#TI").parent().parent().index()].itemDescription = "PC";
        document.getElementById("TI").removeAttribute("id");
    }
   
    //removes table row and properties from a devise.
    self.removeDevise = function (devise) {
        self.devise.remove(devise);
    };
    //Saves properties of devise.
    self.save = function () {
        self.lastSavedJson(JSON.stringify(ko.toJS(self.devise), null, 2));
    };

    self.saveJSON = function () {
        return self.devise();
    };

    self.lastSavedJson = ko.observable("")
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
    //devise section array
    rows: []
}
//Section JSON rows
function binder() {
    rows.rows = dev.devise();
    var jsonData = JSON.stringify(ko.toJS(rows), null, 2);
    console.log(jsonData);
    document.getElementById("bindered").value = jsonData;
    submitJSON("api/values", jsonData);
}
//Section Devise
var dev = new DeviseModel(initialData);
ko.applyBindings(dev);
//Section JSON - DATABASE
function submitJSON(url, output) {
    $("#load").css("display", "block");
    $.ajax({
        url: url,
        data: output,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, xhr) {
            document.getElementById("pageOne").style.display = "none";
            document.getElementById("pageTwo").style.display = "block";
            $("#load").css("display", "none");
            console.log("Success." + xhr.textStatus);
            console.log(output);
        },
        error: function (err) {
            $("#load").css("display", "none");
            alert("Error submitting form. " + err);
        }
    });
}
//barcode scanner
function decode(source, element) {
    var barcode = 0;
    Quagga.decodeSingle({
        decoder: {
            readers: ["code_39_reader"] // List of active readers
        },
        locate: true, // try to locate the barcode in the image
        src: source // or 'data:image/jpg;base64,' + data
    }, function (result) {
        if (result.codeResult) {
            console.log(result.codeResult.code);
            barcode = result.codeResult.code;
            $(element).prev().val(barcode);
            dev.devise()[$(element).parent().parent().index()].barCode = barcode;
        } else {
            console.log("error");
        }
    });
}

function readURL(input) {
    //var index;
    //$(".files").click(function () {
    //    index = $(this).index();
    //})

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            //$('#blah').attr('src', e.target.result);
            decode(e.target.result, input);
        }

        reader.readAsDataURL(input.files[0]);
    }
}
//auto populates date
function getDate() {
    var currentDate = new Date();
    var day = currentDate.getDate(); // Get day
    if (day < 10) { day = "0" + day; } // Add leading 0
    var month = currentDate.getMonth() + 1; // Get month
    if (month < 10) { month = "0" + month; } // Add leading 0 to month
    var year = currentDate.getFullYear(); // Get year
    return year + "-" + month + "-" + day; // Put date in proper format
}
//signs the user out sending the user to the login page.
function signOut() {
    $.ajax({
        url: "api/Roles/1",
        type: "DELETE",
        complete: function (res, textStatus, xhr) {
            window.location = "login.html";
        }
    });
}
//find by picture section
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
})